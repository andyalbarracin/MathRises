"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Clock } from "lucide-react";
import { repository } from "@/data/local/repository";
import { levelForXp, updateStreak } from "@/domain/xp";
import { explainError } from "@/domain/errors";
import type { MockExamResult, ModuleId, UserProgress } from "@/domain/types";
import { getMockExam, buildMockQuestions, MODULE_LABEL, type MockQuestion } from "@/content/mock-exams";
import { todayStr } from "@/lib/date";
import { playSound } from "@/lib/sound";
import { ExerciseView } from "@/components/session/exercise-view";
import { Button } from "@/components/ui/button";
import { MockResults } from "./mock-results";

type Phase = "loading" | "active" | "results";

export function MockRunner({ examId }: { examId: string }) {
  const config = getMockExam(examId);
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<MockExamResult | null>(null);

  const answersRef = useRef<(boolean | null)[]>([]);
  const startRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!config) return;
    let alive = true;
    // IIFE async: la generación ocurre solo en cliente (evita mismatch de hidratación).
    (async () => {
      const seed = `mock-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      const qs = buildMockQuestions(config, seed);
      if (!alive) return;
      answersRef.current = new Array(qs.length).fill(null);
      startRef.current = Date.now();
      setQuestions(qs);
      setSecondsLeft(config.durationMin * 60);
      setPhase("active");
    })();
    return () => {
      alive = false;
    };
  }, [config]);

  const finish = useCallback(async () => {
    if (finishedRef.current || !config) return;
    finishedRef.current = true;

    const answers = answersRef.current;
    const total = questions.length;
    const correct = answers.filter((a) => a === true).length;
    const unanswered = answers.filter((a) => a === null).length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    const grouped = new Map<string, { correct: number; total: number }>();
    questions.forEach((q, i) => {
      const label = MODULE_LABEL[q.module as ModuleId];
      const g = grouped.get(label) ?? { correct: 0, total: 0 };
      g.total += 1;
      if (answers[i] === true) g.correct += 1;
      grouped.set(label, g);
    });
    const breakdown = [...grouped.entries()].map(([module, v]) => ({ module, ...v }));
    const durationMs = Date.now() - startRef.current;

    const res: MockExamResult = {
      id: `mx-${Date.now()}`,
      examId: config.id,
      title: config.title,
      score,
      correct,
      total,
      unanswered,
      durationMs,
      breakdown,
      completedAt: Date.now(),
    };
    await repository.saveMockExam(res);

    // XP por rendir (según puntaje) + racha.
    const prev = await repository.getProgress();
    const gained = Math.round(score / 2) + 10;
    let updated: UserProgress = { ...prev, xp: prev.xp + gained, level: levelForXp(prev.xp + gained) };
    updated = updateStreak(updated, todayStr());
    await repository.saveProgress(updated);

    playSound("complete");
    setResult(res);
    setPhase("results");
  }, [config, questions]);

  // Temporizador
  useEffect(() => {
    if (phase !== "active") return;
    if (secondsLeft <= 0) {
      void finish();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft, finish]);

  async function recordMockError(q: MockQuestion, answer: string) {
    const categories = q.exercise.classifyError(answer);
    await repository.recordError({
      conceptId: q.conceptId,
      exerciseId: q.exercise.id,
      prompt: q.exercise.promptText,
      userAnswer: answer,
      correctAnswer: q.exercise.correctAnswerDisplay,
      categories,
      explanation: explainError(categories),
      nextReviewAt: Date.now() + 86_400_000,
    });
  }

  function record(correct: boolean | null) {
    answersRef.current[index] = correct;
    if (index + 1 >= questions.length) void finish();
    else setIndex((i) => i + 1);
  }

  if (!config) {
    return (
      <CenterScreen>
        <p>Ese simulacro no existe.</p>
        <Link href="/simulacros" className="mt-4 font-bold text-accent">
          Volver a Simulacros
        </Link>
      </CenterScreen>
    );
  }
  if (phase === "loading") return <CenterScreen>Preparando el simulacro…</CenterScreen>;
  if (phase === "results" && result) {
    return (
      <CenterScreen>
        <MockResults result={result} />
      </CenterScreen>
    );
  }

  const q = questions[index];
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const low = secondsLeft <= 30;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-background/85 px-4 py-3 backdrop-blur md:px-8">
        <Link href="/simulacros" aria-label="Salir del simulacro" className="rounded-full p-2 text-ink-muted hover:bg-surface-2 hover:text-ink">
          <X className="h-5 w-5" />
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
        <span className="w-12 text-right text-sm font-bold text-ink-muted nums">
          {index + 1}/{questions.length}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold nums ${low ? "bg-danger-soft text-danger" : "bg-surface-2 text-ink"}`}>
          <Clock className="h-4 w-4" />
          {mm}:{ss}
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-8 md:py-10">
        <div className="pb-24">
          <ExerciseView
            key={q.exercise.id}
            exercise={q.exercise}
            locked={false}
            result={null}
            examMode
            onSubmit={(answer) => {
              const v = q.exercise.validate(answer);
              if (!v.correct) void recordMockError(q, answer);
              record(v.correct);
            }}
          />
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" onClick={() => record(null)}>
              Saltar pregunta
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function CenterScreen({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-dvh place-items-center px-4 py-10 text-center text-ink-muted"><div>{children}</div></div>;
}
