"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Check, X, BookOpen } from "lucide-react";
import type { GeneratedExercise } from "@/domain/exercises";
import { Button } from "@/components/ui/button";
import { Katex } from "@/components/math/katex";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export function FeedbackSheet({
  exercise,
  correct,
  explanation,
  onContinue,
  isLast,
}: {
  exercise: GeneratedExercise;
  correct: boolean;
  explanation: string;
  onContinue: () => void;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showSteps, setShowSteps] = useState(false);

  useLayoutEffect(() => {
    playSound(correct ? "correct" : "wrong");
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { yPercent: 100, duration: 0.35, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, [correct]);

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t-2 px-5 pb-6 pt-5",
        correct ? "border-success bg-success-soft" : "border-danger bg-danger-soft",
      )}
    >
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-full text-white",
              correct ? "bg-success" : "bg-danger",
            )}
          >
            {correct ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn("font-display text-lg", correct ? "text-success" : "text-danger")}>
              {correct ? "¡Correcto!" : "Casi, revisemos"}
            </p>
            {correct ? (
              <p className="mt-0.5 text-sm text-ink">
                {exercise.steps[0]?.note ?? "Bien resuelto."}
              </p>
            ) : (
              <>
                <p className="mt-0.5 text-sm leading-relaxed text-ink">{explanation}</p>
                <p className="mt-1.5 text-sm text-ink">
                  Respuesta correcta:{" "}
                  <span className="font-bold">
                    <Katex expr={exercise.correctAnswerDisplay} />
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {showSteps && (
          <ol className="mt-3 space-y-1.5 rounded-2xl bg-surface/60 p-3">
            {exercise.steps.map((s, i) => (
              <li key={i} className="text-sm">
                <Katex expr={s.latex} className="text-ink" />
                <span className="ml-2 text-ink-muted">{s.note}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4 flex items-center gap-3">
          {!showSteps && (
            <Button variant="ghost" size="sm" onClick={() => setShowSteps(true)}>
              <BookOpen className="h-4 w-4" />
              Ver el porqué
            </Button>
          )}
          <Button
            variant={correct ? "success" : "primary"}
            size="lg"
            className="ml-auto min-w-40"
            onClick={onContinue}
          >
            {isLast ? "Ver resumen" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
