"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import {
  generateExercise,
  TEMPLATES,
  type GeneratedExercise,
} from "@/domain/exercises";
import type { ValidationResult } from "@/domain/validation";
import { buildPlan, type PlanStep } from "@/domain/session/plan";
import {
  initialMastery,
  updateMastery,
} from "@/domain/mastery";
import {
  initialReview,
  schedule,
  getDueReviews,
} from "@/domain/spaced-repetition";
import { xpForAttempt, sessionBonus, levelForXp, updateStreak } from "@/domain/xp";
import { explainError } from "@/domain/errors";
import type {
  Attempt,
  ConceptMastery,
  ReviewSchedule,
  SessionMode,
  UserProgress,
} from "@/domain/types";
import { repository } from "@/data/local/repository";
import { FRACCIONES_CONCEPT_ID } from "@/content/fractions";
import { todayStr } from "@/lib/date";
import { ExerciseView } from "./exercise-view";
import { FeedbackPanel } from "./feedback-panel";
import { ExplanationCard, WorkedExampleCard } from "./intro-cards";
import { SessionSummary, type SummaryData } from "./session-summary";

type Phase = "loading" | "active" | "feedback" | "summary";

const CONCEPT_ID = FRACCIONES_CONCEPT_ID;

export function SessionRunner({ mode = "STANDARD" }: { mode?: SessionMode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [plan, setPlan] = useState<PlanStep[]>([]);
  const [generated, setGenerated] = useState<(GeneratedExercise | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [explanation, setExplanation] = useState("");
  const [summary, setSummary] = useState<SummaryData | null>(null);

  // Acumuladores
  const [xpEarned, setXpEarned] = useState(0);
  const correctRef = useRef(0);
  const totalRef = useRef(0);
  const hintsTotalRef = useRef(0);
  const wrongAnyRef = useRef(false);

  // Estado de dominio que se persiste al final
  const masteryRef = useRef<ConceptMastery>(initialMastery(CONCEPT_ID));
  const masteryBeforeRef = useRef(0);
  const reviewRef = useRef<ReviewSchedule>(initialReview(CONCEPT_ID));
  const progressRef = useRef<UserProgress | null>(null);
  const sessionIdRef = useRef<string>("");
  const stepStartRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);
  const finalizedRef = useRef(false);

  // Carga inicial
  useEffect(() => {
    let alive = true;
    (async () => {
      const [mastery, review, progress] = await Promise.all([
        repository.getMastery(CONCEPT_ID),
        repository.getReview(CONCEPT_ID),
        repository.getProgress(),
      ]);
      if (!alive) return;

      masteryRef.current = mastery ?? initialMastery(CONCEPT_ID);
      masteryBeforeRef.current = masteryRef.current.level;
      reviewRef.current = review ?? initialReview(CONCEPT_ID);
      progressRef.current = progress;

      const hasDue = getDueReviews([reviewRef.current]).length > 0;
      const p = buildPlan(mode, hasDue);
      const sid = `s-${Date.now()}`;
      sessionIdRef.current = sid;

      // Genera un ejercicio por cada paso de tipo exercise.
      let exIdx = 0;
      const gen = p.map((step) => {
        if (step.kind !== "exercise") return null;
        const tpl = TEMPLATES[step.templateId];
        return generateExercise(tpl, sid, exIdx++);
      });

      sessionStartRef.current = Date.now();
      stepStartRef.current = Date.now();
      await repository.createSession({
        id: sid,
        date: todayStr(),
        mode,
        conceptId: CONCEPT_ID,
        xpEarned: 0,
        correctCount: 0,
        totalCount: 0,
        durationMs: 0,
        completedAt: null,
      });

      setPlan(p);
      setGenerated(gen);
      setPhase("active");
    })();
    return () => {
      alive = false;
    };
  }, [mode]);

  const finalize = useCallback(async () => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;

    const total = totalRef.current || 1;
    const accuracy = correctRef.current / total;

    await repository.upsertMastery(masteryRef.current);

    const nextReview = schedule(reviewRef.current, accuracy >= 0.6 ? "ok" : "fail");
    reviewRef.current = nextReview;
    await repository.upsertReview(nextReview);

    const bonus = sessionBonus({
      perfect: !wrongAnyRef.current,
      noHints: hintsTotalRef.current === 0,
      weeklyGoalMet: false,
    });
    const totalXp = xpEarned + bonus;
    const durationMs = Date.now() - sessionStartRef.current;
    const minutes = Math.max(1, Math.round(durationMs / 60000));

    const prev = progressRef.current ?? (await repository.getProgress());
    const newXp = prev.xp + totalXp;
    let updated: UserProgress = {
      ...prev,
      xp: newXp,
      level: levelForXp(newXp),
      weeklyProgressMinutes: prev.weeklyProgressMinutes + minutes,
    };
    updated = updateStreak(updated, todayStr());
    await repository.saveProgress(updated);

    await repository.completeSession({
      id: sessionIdRef.current,
      date: todayStr(),
      mode,
      conceptId: CONCEPT_ID,
      xpEarned: totalXp,
      correctCount: correctRef.current,
      totalCount: totalRef.current,
      durationMs,
      completedAt: Date.now(),
    });

    setSummary({
      xpEarned: totalXp,
      accuracy,
      durationMs,
      correctCount: correctRef.current,
      totalCount: totalRef.current,
      masteryBefore: masteryBeforeRef.current as SummaryData["masteryBefore"],
      masteryAfter: masteryRef.current.level,
      reviewInDays: nextReview.reviewInterval,
    });
    setPhase("summary");
  }, [xpEarned, mode]);

  function advance() {
    const nextIdx = index + 1;
    setResult(null);
    if (nextIdx >= plan.length) {
      setPhase("active"); // placeholder; finalize se dispara por efecto
      setIndex(nextIdx);
    } else {
      setIndex(nextIdx);
      setPhase("active");
      stepStartRef.current = Date.now();
    }
  }

  // Dispara finalize cuando se pasó el último paso.
  useEffect(() => {
    if (phase !== "summary" && plan.length > 0 && index >= plan.length) {
      void finalize();
    }
  }, [index, plan.length, phase, finalize]);

  function handleSubmit(answer: string, hintsUsed: number) {
    const ex = generated[index];
    const step = plan[index];
    if (!ex || step.kind !== "exercise") return;

    const responseMs = Date.now() - stepStartRef.current;
    const res = ex.validate(answer);
    const correct = res.correct;
    const categories = correct ? [] : ex.classifyError(answer);
    const isDelayed = step.isReview && reviewRef.current.reviewCount >= 1;

    // Persistir intento
    const attempt: Attempt = {
      id: `${sessionIdRef.current}-${index}`,
      sessionId: sessionIdRef.current,
      conceptId: CONCEPT_ID,
      exerciseId: ex.id,
      cardType: ex.cardType,
      userAnswer: answer,
      correct,
      hintsUsed,
      responseMs,
      categories,
      createdAt: Date.now(),
    };
    void repository.appendAttempt(attempt);

    // Mastery en memoria
    masteryRef.current = updateMastery(masteryRef.current, {
      correct,
      difficulty: ex.difficulty,
      hintsUsed,
      responseMs,
      cardType: ex.cardType,
      sessionId: sessionIdRef.current,
      isDelayedReview: isDelayed,
    });

    // XP y contadores
    setXpEarned((x) => x + xpForAttempt({ difficulty: ex.difficulty, correct, hintsUsed }));
    totalRef.current += 1;
    hintsTotalRef.current += hintsUsed;
    if (correct) {
      correctRef.current += 1;
    } else {
      wrongAnyRef.current = true;
      void repository.recordError({
        conceptId: CONCEPT_ID,
        exerciseId: ex.id,
        prompt: ex.promptText,
        userAnswer: answer,
        correctAnswer: ex.correctAnswerDisplay,
        categories,
        explanation: explainError(categories),
        nextReviewAt: Date.now() + 86_400_000,
      });
    }

    setExplanation(correct ? "" : explainError(categories));
    setResult(res);
    setPhase("feedback");
  }

  // ---- Render ----
  if (phase === "loading") {
    return <CenterScreen>Preparando tu sesión…</CenterScreen>;
  }

  if (phase === "summary" && summary) {
    return (
      <CenterScreen>
        <SessionSummary data={summary} />
      </CenterScreen>
    );
  }

  if (index >= plan.length) {
    return <CenterScreen>Guardando tu progreso…</CenterScreen>;
  }

  const step = plan[index];
  const ex = generated[index];
  const isLastStep = index === plan.length - 1;
  const progressPct = (index / plan.length) * 100;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Barra superior */}
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-8">
        <Link
          href="/"
          aria-label="Salir de la sesión"
          className="rounded-md p-1.5 text-ink-muted hover:bg-surface-2 hover:text-ink"
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="w-14 text-right text-sm text-ink-muted nums">
          {index + 1}/{plan.length}
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-8 md:py-12">
        {step.kind === "explanation" && <ExplanationCard onContinue={advance} />}
        {step.kind === "worked" && <WorkedExampleCard onContinue={advance} />}
        {step.kind === "exercise" && ex && (
          <div>
            {step.isReview && (
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-accent-2">
                Repaso
              </p>
            )}
            <ExerciseView
              key={ex.id}
              exercise={ex}
              locked={phase === "feedback"}
              result={result}
              onSubmit={handleSubmit}
            />
            {phase === "feedback" && result && (
              <FeedbackPanel
                exercise={ex}
                correct={result.correct}
                explanation={explanation}
                onContinue={advance}
                isLast={isLastStep}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function CenterScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10 text-center text-ink-muted">
      {children}
    </div>
  );
}
