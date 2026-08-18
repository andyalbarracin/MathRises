"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Check, Star, Swords } from "lucide-react";
import { repository } from "@/data/local/repository";
import { getDueReviews } from "@/domain/spaced-repetition";
import type { ConceptMastery, MockExamResult, ReviewSchedule } from "@/domain/types";
import { ROADMAP, type RoadmapNode, type RoadmapSection } from "@/content/roadmap";
import { PLAYABLE } from "@/content/concepts";
import { bossId, BOSS_PASS } from "@/content/mock-exams";
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

export function RoadmapView() {
  const [data, setData] = useState<{
    masteries: ConceptMastery[];
    due: ReviewSchedule[];
    mocks: MockExamResult[];
  } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [masteries, reviews, mocks] = await Promise.all([
        repository.getAllMasteries(),
        repository.getAllReviews(),
        repository.getMockExams(),
      ]);
      if (alive) setData({ masteries, due: getDueReviews(reviews), mocks });
    })();
    return () => {
      alive = false;
    };
  }, []);

  const masteries = data?.masteries ?? [];
  const dueIds = new Set((data?.due ?? []).map((r) => r.conceptId));
  const bossesBeaten = new Set(
    (data?.mocks ?? []).filter((m) => m.score >= BOSS_PASS).map((m) => m.examId),
  );

  return (
    <>
      <PageHeader
        title="Tu camino"
        subtitle="Avanzá tema a tema hasta el ingreso. Dominá cada nodo para que el siguiente cobre vida."
      />

      <div className="mx-auto max-w-md">
        {ROADMAP.map((section) => (
          <section key={section.module} className="mb-10">
            <div className="mb-5 rounded-full bg-surface-2 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-[0.15em] text-ink-muted">
              {section.title}
            </div>
            <ul className="flex flex-col items-center gap-6">
              {section.nodes.map((node, i) => {
                const mastery = masteries.find((m) => m.conceptId === node.conceptId);
                const stateKey = computeState(node, mastery, dueIds);
                const playable = PLAYABLE[node.conceptId];
                // Desplazamiento tipo sendero.
                const offset = [0, 44, 22, -22, -44, -22, 22][i % 7];

                const node_ = (
                  <RoadmapNodeView node={node} state={stateKey} icon={playable?.icon} />
                );
                return (
                  <li key={node.conceptId} style={{ transform: `translateX(${offset}px)` }}>
                    {node.playable ? (
                      <Link href={`/sesion?concept=${node.conceptId}&type=conceptos`}>{node_}</Link>
                    ) : (
                      node_
                    )}
                  </li>
                );
              })}
            </ul>
            <BossNode section={section} masteries={masteries} beaten={bossesBeaten} />
          </section>
        ))}
      </div>
    </>
  );
}

type BossState = "LOCKED" | "READY" | "BEATEN";

function BossNode({
  section,
  masteries,
  beaten,
}: {
  section: RoadmapSection;
  masteries: ConceptMastery[];
  beaten: Set<string>;
}) {
  const playableNodes = section.nodes.filter((n) => n.playable);
  if (playableNodes.length === 0) return null;

  const id = bossId(section.module);
  const levelOf = (cid: string) => masteries.find((m) => m.conceptId === cid)?.level ?? 0;
  const allMastered = playableNodes.every(
    (n) => levelOf(n.conceptId) >= (PLAYABLE[n.conceptId]?.concept.masteryRequired ?? 4),
  );
  const state: BossState = beaten.has(id) ? "BEATEN" : allMastered ? "READY" : "LOCKED";

  const ring =
    state === "BEATEN"
      ? "bg-success text-white border-black/10"
      : state === "READY"
        ? "bg-c-amber text-white border-black/10 shadow-pop"
        : "bg-surface-2 text-ink-muted border-border";
  const label =
    state === "BEATEN" ? "Jefe vencido" : state === "READY" ? "¡Desafío disponible!" : "Dominá el módulo para desbloquear";

  const inner = (
    <div className="group mt-6 flex flex-col items-center">
      <div
        className={cn(
          "grid h-[68px] w-[68px] place-items-center rounded-2xl border-b-4 transition-transform",
          state !== "LOCKED" && "group-hover:-translate-y-1",
          ring,
        )}
      >
        {state === "BEATEN" ? <Check className="h-7 w-7" strokeWidth={2.4} /> : <Swords className="h-7 w-7" strokeWidth={2.4} />}
      </div>
      <p className={cn("mt-2 text-center text-sm font-bold", state === "LOCKED" ? "text-ink-muted" : "text-ink")}>
        Jefe: {section.title}
      </p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );

  return state === "LOCKED" ? (
    <div className="flex justify-center">{inner}</div>
  ) : (
    <Link href={`/simulacros/rendir?exam=${id}`} className="flex justify-center">
      {inner}
    </Link>
  );
}

const STATE_STYLE: Record<NodeState, { ring: string; label: string }> = {
  LOCKED: { ring: "bg-surface-2 text-ink-muted border-border", label: "Próximamente" },
  AVAILABLE: { ring: "bg-accent text-accent-ink border-accent-strong shadow-pop", label: "Empezar" },
  IN_PROGRESS: { ring: "bg-accent text-accent-ink border-accent-strong shadow-pop", label: "En progreso" },
  MASTERED: { ring: "bg-success text-white border-black/10", label: "Dominado" },
  REVIEW_DUE: { ring: "bg-c-amber text-white border-black/10", label: "Repaso" },
};

function RoadmapNodeView({
  node,
  state,
  icon: Icon,
}: {
  node: RoadmapNode;
  state: NodeState;
  icon?: React.ElementType;
}) {
  const s = STATE_STYLE[state];
  const isLocked = state === "LOCKED";
  const Glyph = state === "MASTERED" ? Check : state === "LOCKED" ? Lock : Icon ?? Star;

  return (
    <div className="group flex w-64 flex-col items-center">
      <div
        className={cn(
          "grid h-[68px] w-[68px] place-items-center rounded-full border-b-4 transition-transform",
          !isLocked && "group-hover:-translate-y-1",
          s.ring,
        )}
      >
        <Glyph className="h-7 w-7" strokeWidth={2.4} />
      </div>
      <p className={cn("mt-2 text-center text-sm font-bold", isLocked ? "text-ink-muted" : "text-ink")}>
        {node.title}
      </p>
      <p className="text-xs text-ink-muted">
        Semana {node.targetWeek} · {s.label}
      </p>
    </div>
  );
}
