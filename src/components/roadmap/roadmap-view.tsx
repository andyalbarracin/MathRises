"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Check, Play, RefreshCw, CircleDot } from "lucide-react";
import { repository } from "@/data/local/repository";
import { getDueReviews } from "@/domain/spaced-repetition";
import type { ConceptMastery, ReviewSchedule } from "@/domain/types";
import { ROADMAP, type RoadmapNode } from "@/content/roadmap";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

type NodeState = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "MASTERED" | "REVIEW_DUE";

function computeState(
  node: RoadmapNode,
  mastery: ConceptMastery | undefined,
  dueIds: Set<string>,
): NodeState {
  if (!node.playable) return "LOCKED";
  if (dueIds.has(node.conceptId)) return "REVIEW_DUE";
  const level = mastery?.level ?? 0;
  if (level >= 4) return "MASTERED";
  if ((mastery?.attempts ?? 0) > 0 || level > 0) return "IN_PROGRESS";
  return "AVAILABLE";
}

const STATE_META: Record<
  NodeState,
  { label: string; icon: React.ElementType; dot: string; text: string }
> = {
  LOCKED: { label: "Próximamente", icon: Lock, dot: "border-border bg-surface-2 text-ink-muted", text: "text-ink-muted" },
  AVAILABLE: { label: "Disponible", icon: Play, dot: "border-accent bg-accent/15 text-accent", text: "text-ink" },
  IN_PROGRESS: { label: "En progreso", icon: CircleDot, dot: "border-accent bg-accent text-accent-ink", text: "text-ink" },
  MASTERED: { label: "Dominado", icon: Check, dot: "border-success bg-success text-white", text: "text-ink" },
  REVIEW_DUE: { label: "Repaso pendiente", icon: RefreshCw, dot: "border-accent-2 bg-accent-2/15 text-accent-2", text: "text-ink" },
};

export function RoadmapView() {
  const [data, setData] = useState<{ masteries: ConceptMastery[]; due: ReviewSchedule[] } | null>(
    null,
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      const [masteries, reviews] = await Promise.all([
        repository.getAllMasteries(),
        repository.getAllReviews(),
      ]);
      if (!alive) return;
      setData({ masteries, due: getDueReviews(reviews) });
    })();
    return () => {
      alive = false;
    };
  }, []);

  const masteries = data?.masteries ?? [];
  const dueIds = new Set((data?.due ?? []).map((r) => r.conceptId));

  return (
    <>
      <PageHeader
        title="Roadmap"
        subtitle="Tu camino hasta el ingreso, semana a semana. Dominá cada nodo para desbloquear el siguiente."
      />

      <div className="mx-auto max-w-2xl">
        {ROADMAP.map((section) => (
          <section key={section.module} className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">
              {section.title}
            </h2>
            <div className="relative">
              {/* Rail vertical */}
              <div className="absolute bottom-4 left-[19px] top-4 w-px bg-border" aria-hidden />
              <ul className="space-y-1.5">
                {section.nodes.map((node) => {
                  const mastery = masteries.find((m) => m.conceptId === node.conceptId);
                  const stateKey = computeState(node, mastery, dueIds);
                  const meta = STATE_META[stateKey];
                  const Icon = meta.icon;
                  const clickable = node.playable;

                  const inner = (
                    <div
                      className={cn(
                        "relative flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors",
                        clickable
                          ? "border-border bg-surface hover:border-accent/50"
                          : "border-transparent",
                      )}
                    >
                      <span
                        className={cn(
                          "z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2",
                          meta.dot,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-sm font-medium", meta.text)}>{node.title}</p>
                        <p className="text-xs text-ink-muted">
                          Semana {node.targetWeek} · {meta.label}
                        </p>
                      </div>
                      {clickable && (
                        <span className="text-xs font-medium text-accent">Practicar</span>
                      )}
                    </div>
                  );

                  return (
                    <li key={node.conceptId}>
                      {clickable ? (
                        <Link href="/sesion?mode=STANDARD">{inner}</Link>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
