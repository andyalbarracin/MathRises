"use client";

import { useEffect, useState } from "react";
import { TriangleAlert, CircleCheck } from "lucide-react";
import { repository } from "@/data/local/repository";
import { ERROR_LABELS, type ErrorCategory, type ErrorRecord } from "@/domain/types";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Katex } from "@/components/math/katex";

function labelFor(cat: ErrorCategory): string {
  return ERROR_LABELS[cat] ?? cat;
}

export function ErrorsView() {
  const [errors, setErrors] = useState<ErrorRecord[] | null>(null);

  useEffect(() => {
    let alive = true;
    repository.getErrors().then((e) => {
      if (alive) setErrors(e);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!errors) {
    return <div className="h-32 animate-pulse rounded-2xl border border-border bg-surface/50" />;
  }

  // Agregación por categoría principal.
  const byCategory = new Map<ErrorCategory, number>();
  for (const e of errors) {
    const cat = e.categories[0] ?? "UNKNOWN";
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + e.count);
  }
  const ranking = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageHeader
        title="Registro de errores"
        subtitle="El sistema detecta tus patrones de error y los devuelve como repaso dirigido."
      />

      {errors.length === 0 ? (
        <EmptyState
          icon={CircleCheck}
          title="Sin errores registrados"
          description="Cuando falles un ejercicio, va a aparecer acá clasificado por tipo, con su explicación y su repaso programado."
        />
      ) : (
        <>
          {/* Dashboard de recurrentes */}
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-ink">Errores recurrentes</p>
            <ul className="mt-4 space-y-3">
              {ranking.map(([cat, count]) => {
                const max = ranking[0][1];
                return (
                  <li key={cat} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-sm text-ink-muted">
                      {labelFor(cat)}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-warn"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm text-ink nums">{count}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Detalle */}
          <section className="mt-5 space-y-3">
            {errors.map((e) => (
              <article key={e.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warn">
                    <TriangleAlert className="h-4 w-4" />
                    {labelFor(e.categories[0] ?? "UNKNOWN")}
                  </span>
                  <span className="text-xs text-ink-muted nums">
                    {e.count}{e.count === 1 ? " vez" : " veces"}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-ink-muted">Ejercicio: </span>
                  <span className="nums text-ink">{e.prompt}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <span className="text-ink-muted">
                    Tu respuesta: <span className="text-danger nums">{e.userAnswer}</span>
                  </span>
                  <span className="text-ink-muted">
                    Correcta: <Katex expr={e.correctAnswer} className="text-success" />
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{e.explanation}</p>
              </article>
            ))}
          </section>
        </>
      )}
    </>
  );
}
