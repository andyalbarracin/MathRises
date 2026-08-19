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
import { initialMastery, updateMastery } from "@/domain/mastery";
import { initialReview, schedule, getDueReviews } from "@/domain/spaced-repetition";
import { xpForAttempt, sessionBonus, levelForXp, updateStreak } from "@/domain/xp";
import { explainError } from "@/domain/errors";
import type {
  Attempt,
  ConceptMastery,
  ReviewSchedule,
  SessionMode,
  SessionType,
  UserProgress,
} from "@/domain/types";
import { repository } from "@/data/local/repository";
import { getPlayable } from "@/content/concepts";
import { todayStr } from "@/lib/date";
import { ExerciseView } from "./exercise-view";
import { FeedbackSheet } from "./feedback-sheet";
import { ExplanationCard, WorkedExampleCard } from "./intro-cards";
import { SessionSummary, type SummaryData } from "./session-summary";
import { LoadingState } from "@/components/ui/states";

type Phase = "loading" | "active" | "feedback" | "summary";

const PASSIVE_XP = 8;

export function SessionRunner({
  conceptId,
  type = "practica",
  mode = "STANDARD",
}: {
  conceptId: string;
  type?: SessionType;
  mode?: SessionMode;
}) {
  const playable = getPlayable(conceptId);

  const [phase, setPhase] = useState<Phase>("loading");
  const [plan, setPlan] = useState<PlanStep[]>([]);
  const [generated, setGenerated] = useState<(GeneratedExercise | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [explanation, setExplanation] = useState("");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [xpEarned, setXpEarned] = useState(0);

  const correctRef = useRef(0);
  const totalRef = useRef(0);
  const hintsTotalRef = useRef(0);
  const wrongAnyRef = useRef(false);

  const masteryRef = useRef<ConceptMastery>(initialMastery(conceptId));
  const masteryBeforeRef = useRef(0);
  const reviewRef = useRef<ReviewSchedule>(initialReview(conceptId));
  const progressRef = useRef<UserProgress | null>(null);
  const sessionIdRef = useRef<string>("");
  const stepStartRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);
  const finalizedRef = useRef(false);

  useEffect(() => {
    if (!playable) return;
    let alive = true;
    (async () => {
      const [mastery, review, progress] = await Promise.all([
        repository.getMastery(conceptId),
        repository.getReview(conceptId),
        repository.getProgress(),
      ]);
      if (!alive) return;

      masteryRef.current = mastery ?? initialMastery(conceptId);
      masteryBeforeRef.current = masteryRef.current.level;
      reviewRef.current = review ?? initialReview(conceptId);
      progressRef.current = progress;

      const hasDue = getDueReviews([reviewRef.current]).length > 0;
      const p = buildPlan({ templateIds: playable.templateIds, type, mode, hasDueReview: hasDue });
      // Semilla con componente aleatorio: garantiza ejercicios distintos en cada sesión.
      const sid = `s-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      sessionIdRef.current = sid;

      let exIdx = 0;
      const gen = p.map((step) => {
        if (step.kind !== "exercise") return null;
        return generateExercise(TEMPLATES[step.templateId], sid, exIdx++);
      });

      sessionStartRef.current = Date.now();
      stepStartRef.current = Date.now();
      await repository.createSession({
        id: sid,
        date: todayStr(),
        mode,
        sessionType: type,
        conceptId,
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
  }, [conceptId, type, mode, playable]);

  const finalize = useCallback(async () => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;

    const total = totalRef.current;
    const accuracy = total > 0 ? correctRef.current / total : 1;
    const passive = total === 0;

    if (!passive) {
      await repository.upsertMastery(masteryRef.current);
      const nextReview = schedule(reviewRef.current, accuracy >= 0.6 ? "ok" : "fail");
      reviewRef.current = nextReview;
      await repository.upsertReview(nextReview);
    }

    const bonus = passive
      ? 0
      : sessionBonus({
          perfect: !wrongAnyRef.current,
          noHints: hintsTotalRef.current === 0,
          weeklyGoalMet: false,
        });
    const totalXp = passive ? PASSIVE_XP : xpEarned + bonus;
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
      sessionType: type,
      conceptId,
      xpEarned: totalXp,
      correctCount: correctRef.current,
      totalCount: total,
      durationMs,
      completedAt: Date.now(),
    });

    setSummary({
      sessionType: type,
      xpEarned: totalXp,
      accuracy,
      durationMs,
      correctCount: correctRef.current,
      totalCount: total,
      masteryBefore: masteryBeforeRef.current as SummaryData["masteryBefore"],
      masteryAfter: masteryRef.current.level,
      reviewInDays: reviewRef.current.reviewInterval || 1,
    });
    setPhase("summary");
  }, [xpEarned, mode, type, conceptId]);

  function advance() {
    setResult(null);
    setIndex((i) => i + 1);
    setPhase("active");
    stepStartRef.current = Date.now();
  }

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

    const attempt: Attempt = {
      id: `${sessionIdRef.current}-${index}`,
      sessionId: sessionIdRef.current,
      conceptId,
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

    masteryRef.current = updateMastery(masteryRef.current, {
      correct,
      difficulty: ex.difficulty,
      hintsUsed,
      responseMs,
      cardType: ex.cardType,
      sessionId: sessionIdRef.current,
      isDelayedReview: isDelayed,
    });

    setXpEarned((x) => x + xpForAttempt({ difficulty: ex.difficulty, correct, hintsUsed }));
    totalRef.current += 1;
    hintsTotalRef.current += hintsUsed;
    if (correct) {
      correctRef.current += 1;
    } else {
      wrongAnyRef.current = true;
      void repository.recordError({
        conceptId,
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

  if (!playable) {
    return (
      <CenterScreen>
        <p>Este tema todavía no está disponible.</p>
        <Link href="/" className="mt-4 font-bold text-accent">
          Volver a Hoy
        </Link>
      </CenterScreen>
    );
  }
  if (phase === "loading") return <LoadingState label="Preparando tu sesión" />;
  if (phase === "summary" && summary) {
    return (
      <CenterScreen>
        <SessionSummary data={summary} />
      </CenterScreen>
    );
  }
  if (index >= plan.length) return <CenterScreen>Guardando tu progreso…</CenterScreen>;

  const step = plan[index];
  const ex = generated[index];
  const isLastStep = index === plan.length - 1;
  const progressPct = (index / plan.length) * 100;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-background/85 px-4 py-3 backdrop-blur md:px-8">
        <Link
          href="/"
          aria-label="Salir de la sesión"
          className="rounded-full p-2 text-ink-muted hover:bg-surface-2 hover:text-ink"
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="w-12 text-right text-sm font-bold text-ink-muted nums">
          {index + 1}/{plan.length}
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-8 md:py-10">
        {step.kind === "explanation" && (
          <ExplanationCard lesson={playable.lesson} onContinue={advance} />
        )}
        {step.kind === "worked" && (
          <WorkedExampleCard lesson={playable.lesson} onContinue={advance} lastStep={isLastStep} />
        )}
        {step.kind === "exercise" && ex && (
          <div className="pb-40">
            {step.isReview && (
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-c-amber">
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
          </div>
        )}
      </main>

      {phase === "feedback" && ex && result && (
        <FeedbackSheet
          exercise={ex}
          correct={result.correct}
          explanation={explanation}
          onContinue={advance}
          isLast={isLastStep}
        />
      )}
    </div>
  );
}

function CenterScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10 text-center text-ink-muted">
      <div>{children}</div>
    </div>
  );
}
