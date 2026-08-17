"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import type { GeneratedExercise } from "@/domain/exercises";
import type { ValidationResult } from "@/domain/validation";
import { Button } from "@/components/ui/button";
import { Katex } from "@/components/math/katex";
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
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hintsShown, setHintsShown] = useState(0);

  const isChoice =
    exercise.cardType === "MULTIPLE_CHOICE" || exercise.cardType === "ERROR_SPOTTING";
  const answer = isChoice ? selected ?? "" : text;
  const canSubmit = answer.trim() !== "" && !locked;

  function submit() {
    if (!canSubmit) return;
    onSubmit(answer, hintsShown);
  }

  return (
    <div>
      <p className="text-sm text-ink-muted">{exercise.instruction}</p>

      {/* Enunciado */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2/50 px-5 py-6 text-center">
        <Katex expr={exercise.promptLatex} display className="text-xl" />
      </div>

      {/* Controles */}
      <div className="mt-5">
        {isChoice ? (
          <div className="grid gap-2.5">
            {exercise.options!.map((opt) => {
              const isSel = selected === opt.id;
              const isCorrect = locked && exercise.validate(opt.id).correct;
              const isWrongSel = locked && isSel && result && !result.correct;
              return (
                <button
                  key={opt.id}
                  type="button"
                  data-testid="option"
                  disabled={locked}
                  onClick={() => setSelected(opt.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    isCorrect
                      ? "border-success/60 bg-success/10 text-ink"
                      : isWrongSel
                        ? "border-danger/60 bg-danger/10 text-ink"
                        : isSel
                          ? "border-accent bg-accent/10 text-ink"
                          : "border-border bg-surface hover:border-accent/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs",
                      isSel ? "border-accent text-accent" : "border-border text-ink-muted",
                    )}
                  >
                    {String.fromCharCode(65 + Number(opt.id))}
                  </span>
                  {opt.latex ? <Katex expr={opt.latex} /> : <span>{opt.text}</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <input
            inputMode="text"
            autoFocus
            data-testid="answer-input"
            disabled={locked}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ej: 5/6"
            className={cn(
              "nums w-full rounded-lg border border-border bg-surface px-4 py-3 text-lg outline-none transition-colors focus:border-accent",
              locked && "opacity-70",
            )}
          />
        )}
      </div>

      {/* Pistas reveladas */}
      {hintsShown > 0 && (
        <ul className="mt-4 space-y-2">
          {exercise.hints.slice(0, hintsShown).map((h, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-lg border border-warn/30 bg-warn/5 px-3 py-2 text-sm text-ink"
            >
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* Acciones */}
      {!locked && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHintsShown((n) => Math.min(3, n + 1))}
            disabled={hintsShown >= 3}
          >
            <Lightbulb className="h-4 w-4" />
            {hintsShown === 0 ? "Pista" : `Otra pista (${hintsShown}/3)`}
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            Responder
          </Button>
        </div>
      )}
    </div>
  );
}
