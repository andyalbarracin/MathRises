"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ChevronRight } from "lucide-react";
import { repository } from "@/data/local/repository";
import { getDueReviews } from "@/domain/spaced-repetition";
import { levelName } from "@/domain/xp";
import type { ConceptMastery, ReviewSchedule, UserProgress } from "@/domain/types";
import { ROADMAP, TARGET_DATE } from "@/content/roadmap";
import { PLAYABLE, PLAYABLE_ORDER } from "@/content/concepts";
import { SESSION_TYPES, SESSION_TYPE_ORDER } from "@/content/session-types";
import { daysUntil } from "@/lib/date";
import { useToast } from "@/components/ui/toast";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { Tile } from "@/components/ui/tile";
import { Badge } from "@/components/ui/badge";
import { Mascot } from "@/components/art/mascot";
import { Flame } from "@/components/art/scenes";

interface State {
  progress: UserProgress;
  masteries: ConceptMastery[];
  dueReviews: ReviewSchedule[];
  name: string;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Buenas noches";
  if (h < 13) return "Buen día";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

const TOTAL_NODES = ROADMAP.reduce((acc, s) => acc + s.nodes.length, 0);

export function TodayView() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const progress = await repository.getProgress();
      if (!alive) return;
      if (!progress.onboardingComplete) {
        router.replace("/onboarding");
        return;
      }
      const [masteries, reviews, profile] = await Promise.all([
        repository.getAllMasteries(),
        repository.getAllReviews(),
        repository.getProfile(),
      ]);
      if (!alive) return;
      const due = getDueReviews(reviews);
      setState({ progress, masteries, dueReviews: due, name: profile?.name ?? "" });

      // Saludo una vez por pestaña.
      try {
        if (!sessionStorage.getItem("rm-welcomed")) {
          sessionStorage.setItem("rm-welcomed", "1");
          if (progress.streak > 0) {
            toast({ emoji: "🔥", title: `Racha de ${progress.streak} ${progress.streak === 1 ? "día" : "días"}`, description: "¡No la cortes!" });
          } else {
            toast({ emoji: "👋", title: "¡A darle!", description: due.length > 0 ? `Tenés ${due.length} repasos` : "Sumá tu primer día" });
          }
        }
      } catch {
        /* sessionStorage no disponible */
      }
    })();
    return () => {
      alive = false;
    };
  }, [router, toast]);

  if (!state) {
    return <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-3xl bg-surface-2/60" />;
  }

  const { progress, masteries, dueReviews, name } = state;
  const firstName = name.split(" ")[0];
  const levelOf = (id: string) => masteries.find((m) => m.conceptId === id)?.level ?? 0;

  const sumLevels = masteries.reduce((a, m) => a + m.level, 0);
  const readiness = Math.round((sumLevels / (5 * TOTAL_NODES)) * 100);
  const days = daysUntil(TARGET_DATE);

  // Concepto actual: el primero jugable sin dominar.
  const currentId =
    PLAYABLE_ORDER.find((id) => levelOf(id) < (PLAYABLE[id]?.concept.masteryRequired ?? 4)) ??
    PLAYABLE_ORDER[PLAYABLE_ORDER.length - 1];
  const current = PLAYABLE[currentId];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink md:text-3xl">
          {greeting()}
          {firstName ? `, ${firstName}` : ""} 👋
        </h1>
        <div className="flex items-center gap-2">
          <Badge tone="streak">
            <Flame size={15} active={progress.streak > 0} />
            {progress.streak} {progress.streak === 1 ? "día" : "días"}
          </Badge>
          <Badge tone="accent">
            <Zap className="h-3.5 w-3.5" />
            {progress.xp} XP
          </Badge>
        </div>
      </div>

      {/* Hero */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-accent-soft p-5 shadow-card sm:p-6">
        <div className="flex items-center gap-5">
          <ProgressRing value={readiness} size={104} stroke={11}>
            <div>
              <p className="font-display text-2xl text-ink nums">{readiness}%</p>
              <p className="-mt-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                listo
              </p>
            </div>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg text-ink">
              {readiness < 20 ? "¡Arranquemos el camino!" : "¡Vas muy bien!"}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Nivel {progress.level} · {levelName(progress.level)}. Faltan{" "}
              <span className="font-bold text-ink nums">{days}</span> días para el ingreso.
            </p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <Mascot tone="violet" expression="cheer" symbol="+" size={92} />
          </div>
        </div>
      </div>

      {/* Tipos de sesión */}
      <section className="mt-7">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg text-ink">¿Cómo querés estudiar hoy?</h2>
          <Link href="/roadmap" className="text-sm font-bold text-accent hover:underline">
            Ver camino
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SESSION_TYPE_ORDER.map((t) => {
            const info = SESSION_TYPES[t];
            const Icon = info.icon;
            const dueCount = t === "repaso" ? dueReviews.length : null;
            return (
              <Link
                key={t}
                href={`/sesion?concept=${currentId}&type=${t}`}
                className="group flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <Tile icon={Icon} tone={info.tone} size={54} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-[17px] text-ink">{info.label}</p>
                    {dueCount != null && dueCount > 0 && (
                      <Badge tone="warn">{dueCount}</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{info.blurb}</p>
                  <p className="mt-1 text-xs font-semibold text-ink-muted">{info.minutes}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Camino actual */}
      <section className="mt-7 rounded-3xl border border-border bg-surface p-5 shadow-card">
        <div className="flex items-center gap-3">
          <Tile icon={current.icon} tone={current.tone} size={46} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-muted">Estás en</p>
            <p className="font-display text-[17px] text-ink">{current.concept.title}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={(levelOf(currentId) / 5) * 100} />
          <span className="w-10 shrink-0 text-right text-sm font-bold text-ink-muted nums">
            {Math.round((levelOf(currentId) / 5) * 100)}%
          </span>
        </div>
      </section>
    </div>
  );
}
