"use client";

import { useState } from "react";
import { AREAS, DIAGNOSTIC } from "@/content/diagnostic";
import { Katex } from "@/components/math/katex";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function DiagnosticRunner({
  onComplete,
}: {
  onComplete: (answers: Record<string, string>) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string | null>(null);

  const q = DIAGNOSTIC[index];
  const area = AREAS[q.area];
  const total = DIAGNOSTIC.length;

  function choose(optId: string) {
    if (picked) return;
    setPicked(optId);
    const next = { ...answers, [q.id]: optId };
    setAnswers(next);
    window.setTimeout(() => {
      if (index + 1 >= total) {
        onComplete(next);
      } else {
        setIndex(index + 1);
        setPicked(null);
      }
    }, 240);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Progreso */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-ink-muted nums">
          {index + 1}/{total}
        </span>
      </div>

      <Reveal key={q.id}>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-ink-muted">
          <span aria-hidden>{area.emoji}</span>
          {area.label}
        </div>

        <p className="mt-4 text-lg text-ink">{q.prompt}</p>
        {q.latex && (
          <div className="mt-3 rounded-xl border border-border bg-surface-2/50 px-5 py-5 text-center">
            <Katex expr={q.latex} display className="text-xl" />
          </div>
        )}

        <div className="mt-5 grid gap-2.5">
          {q.options.map((opt) => {
            const isPicked = picked === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.id)}
                disabled={!!picked}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  isPicked
                    ? "border-accent bg-accent/12 text-ink"
                    : "border-border bg-surface hover:border-accent/40 disabled:opacity-60",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs",
                    isPicked ? "border-accent text-accent" : "border-border text-ink-muted",
                  )}
                >
                  {String.fromCharCode(65 + Number(opt.id))}
                </span>
                {q.latexOptions ? <Katex expr={opt.label} /> : <span>{opt.label}</span>}
              </button>
            );
          })}
        </div>
      </Reveal>

      <p className="mt-6 text-center text-xs text-ink-muted">
        No hay nota. Respondé lo que sepas: esto solo ubica tu punto de partida.
      </p>
    </div>
  );
}
