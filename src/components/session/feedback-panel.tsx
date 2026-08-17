"use client";

import { useState } from "react";
import { Check, X, ListOrdered } from "lucide-react";
import type { GeneratedExercise } from "@/domain/exercises";
import { Button } from "@/components/ui/button";
import { Katex } from "@/components/math/katex";
import { cn } from "@/lib/utils";

export function FeedbackPanel({
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
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div
      className={cn(
        "mt-5 rounded-xl border p-4",
        correct ? "border-success/40 bg-success/8" : "border-danger/40 bg-danger/8",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full",
            correct ? "bg-success text-white" : "bg-danger text-white",
          )}
        >
          {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </span>
        <p className="font-medium text-ink">{correct ? "¡Correcto!" : "Todavía no"}</p>
      </div>

      {!correct && (
        <>
          <p className="mt-2 text-sm leading-relaxed text-ink">{explanation}</p>
          <p className="mt-2 text-sm text-ink-muted">
            Respuesta correcta: <Katex expr={exercise.correctAnswerDisplay} className="text-ink" />
          </p>
        </>
      )}

      {showSteps && (
        <ol className="mt-3 space-y-2 border-t border-border/60 pt-3">
          {exercise.steps.map((s, i) => (
            <li key={i} className="text-sm">
              <Katex expr={s.latex} className="text-ink" />
              <span className="ml-2 text-ink-muted">— {s.note}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        {!showSteps ? (
          <Button variant="ghost" size="sm" onClick={() => setShowSteps(true)}>
            <ListOrdered className="h-4 w-4" />
            Ver paso a paso
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onContinue}>{isLast ? "Ver resumen" : "Continuar"}</Button>
      </div>
    </div>
  );
}
