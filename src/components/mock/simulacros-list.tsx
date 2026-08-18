"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { repository } from "@/data/local/repository";
import type { MockExamResult } from "@/domain/types";
import { MOCK_EXAMS } from "@/content/mock-exams";
import { PageHeader } from "@/components/ui/page-header";
import { Tile } from "@/components/ui/tile";

export function SimulacrosList() {
  const [history, setHistory] = useState<MockExamResult[] | null>(null);

  useEffect(() => {
    let alive = true;
    repository.getMockExams().then((h) => {
      if (alive) setHistory(h);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Simulacros"
        subtitle="Exámenes de práctica cronometrados, sin pistas ni corrección hasta el final. Como en el ingreso."
      />

      <div className="mx-auto max-w-2xl space-y-3">
        {MOCK_EXAMS.map((exam) => {
          const Icon = exam.icon;
          return (
            <Link
              key={exam.id}
              href={`/simulacros/rendir?exam=${exam.id}`}
              className="group flex items-center gap-4 rounded-3xl bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5"
            >
              <Tile icon={Icon} tone={exam.tone} size={54} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[17px] text-ink">{exam.title}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{exam.subtitle}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {exam.durationMin} min · {exam.questionCount} preguntas
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>

      {history && history.length > 0 && (
        <section className="mx-auto mt-8 max-w-2xl">
          <h2 className="mb-3 font-display text-lg text-ink">Tus simulacros</h2>
          <ul className="space-y-2">
            {history.slice(0, 8).map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft font-display text-sm font-bold text-accent nums">
                  {r.score}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{r.title}</p>
                  <p className="text-xs text-ink-muted nums">
                    {r.correct}/{r.total} · {new Date(r.completedAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
