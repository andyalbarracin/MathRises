"use client";

import { useState } from "react";
import { Lightbulb, Check } from "lucide-react";
import type { GeneratedExercise } from "@/domain/exercises";
import type { ValidationResult } from "@/domain/validation";
import { Button } from "@/components/ui/button";
import { Katex } from "@/components/math/katex";
import { MathAnswerPad } from "./math-pad";
import { cn } from "@/lib/utils";

export function ExerciseView({
  exercise,
  locked,
  result,
  onSubmit,
}: {
  exercise: GeneratedExercise;
  locked: boolean;
  result: ValidationResult | null;
  onSubmit: (answer: string, hintsUsed: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hintsShown, setHintsShown] = useState(0);

  const isChoice =
    exercise.cardType === "MULTIPLE_CHOICE" || exercise.cardType === "ERROR_SPOTTING";

  return (
    <div>
      <p className="text-center text-sm font-semibold text-ink-muted">{exercise.instruction}</p>

      {/* Enunciado */}
      <div className="mt-4 grid min-h-[96px] place-items-center rounded-3xl border border-border bg-surface px-5 py-7 text-center shadow-card">
        <Katex expr={exercise.promptLatex} display className="text-2xl" />
      </div>

      {/* Pistas */}
      {hintsShown > 0 && (
        <ul className="mt-4 space-y-2">
          {exercise.hints.slice(0, hintsShown).map((h, i) => (
            <li
              key={i}
              className="flex gap-2.5 rounded-2xl bg-c-amber-soft px-4 py-3 text-sm text-ink"
            >
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-c-amber" />
              {h}
            </li>
          ))}
        </ul>
      )}

      {!locked && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setHintsShown((n) => Math.min(3, n + 1))}
            disabled={hintsShown >= 3}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-c-amber transition-colors hover:bg-c-amber-soft disabled:opacity-40"
          >
            <Lightbulb className="h-4 w-4" />
            {hintsShown === 0 ? "¿Una pista?" : hintsShown < 3 ? "Otra pista" : "Sin más pistas"}
          </button>
        </div>
      )}

      {/* Controles */}
      <div className="mt-5">
        {isChoice ? (
          <ChoiceControls
            exercise={exercise}
            locked={locked}
            result={result}
            selected={selected}
            onSelect={setSelected}
            onSubmit={() => selected && onSubmit(selected, hintsShown)}
          />
        ) : (
          <MathAnswerPad onSubmit={(v) => onSubmit(v, hintsShown)} disabled={locked} />
        )}
      </div>
    </div>
  );
}

function ChoiceControls({
  exercise,
  locked,
  result,
  selected,
  onSelect,
  onSubmit,
}: {
  exercise: GeneratedExercise;
  locked: boolean;
  result: ValidationResult | null;
  selected: string | null;
  onSelect: (id: string) => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <div className="grid gap-2.5">
        {exercise.options!.map((opt) => {
          const isSel = selected === opt.id;
          const isCorrect = locked && exercise.validate(opt.id).correct;
          const isWrongSel = locked && isSel && result && !result.correct;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(opt.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-[15px] font-semibold transition-all active:translate-y-0.5",
                isCorrect
                  ? "border-success bg-success-soft text-ink"
                  : isWrongSel
                    ? "border-danger bg-danger-soft text-ink"
                    : isSel
                      ? "border-accent bg-accent-soft text-ink"
                      : "border-border bg-surface hover:border-accent/50",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                  isSel ? "bg-accent text-accent-ink" : "bg-surface-2 text-ink-muted",
                )}
              >
                {String.fromCharCode(65 + Number(opt.id))}
              </span>
              {opt.latex ? <Katex expr={opt.latex} /> : <span>{opt.text}</span>}
            </button>
          );
        })}
      </div>
      {!locked && (
        <Button className="mt-5 w-full" size="lg" disabled={!selected} onClick={onSubmit}>
          <Check className="h-5 w-5" />
          Responder
        </Button>
      )}
    </>
  );
}
