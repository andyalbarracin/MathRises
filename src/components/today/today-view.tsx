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
import { daysUntil, todayStr } from "@/lib/date";
import { useToast } from "@/components/ui/toast";
import { Tile } from "@/components/ui/tile";
import { Badge } from "@/components/ui/badge";
import { MascotFull } from "@/components/art/mascot";
import { Flame } from "@/components/art/scenes";

interface State {
  progress: UserProgress;
  masteries: ConceptMastery[];
  dueReviews: ReviewSchedule[];
  name: string;
  targetDate: string;
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
      const [masteries, reviews, profile, recent] = await Promise.all([
        repository.getAllMasteries(),
        repository.getAllReviews(),
        repository.getProfile(),
        repository.getRecentSessions(30),
      ]);
      if (!alive) return;
      const due = getDueReviews(reviews);
      setState({ progress, masteries, dueReviews: due, name: profile?.name ?? "", targetDate: profile?.targetDate ?? TARGET_DATE });

      // Recordatorio una vez por pestaña, según la actividad de hoy.
      try {
        if (!sessionStorage.getItem("rm-welcomed")) {
          sessionStorage.setItem("rm-welcomed", "1");
          const studiedToday = recent.some((s) => s.completedAt !== null && s.date === todayStr());
          if (studiedToday) {
            toast({ emoji: "✅", title: "Ya sumaste hoy", description: progress.streak > 0 ? `Racha de ${progress.streak} ${progress.streak === 1 ? "día" : "días"} 🔥` : "¡Bien ahí!" });
          } else if (progress.streak > 0) {
            toast({ emoji: "🔥", title: `Racha de ${progress.streak} ${progress.streak === 1 ? "día" : "días"} en juego`, description: "Sumá una sesión hoy para no cortarla." });
          } else {
            toast({ emoji: "👋", title: "¡A darle!", description: due.length > 0 ? `Tenés ${due.length} repasos para hacer` : "Sumá tu primer día" });
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
  const days = daysUntil(state.targetDate);

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

      {/* Hero: continuar donde te quedaste (clickeable) */}
      {(() => {
        const conceptLevel = levelOf(currentId);
        const started = conceptLevel > 0;
        const href = `/sesion?concept=${currentId}&type=${started ? "practica" : "conceptos"}`;
        return (
          <Link
            href={href}
            className="mt-5 block overflow-hidden rounded-3xl bg-accent p-5 text-accent-ink shadow-card transition-all hover:brightness-[1.04] hover:shadow-[var(--elev-2)] sm:p-6"
          >
            <div className="flex items-center gap-5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                  {started ? "Seguí donde te quedaste" : "Empecemos el camino"}
                </p>
                <p className="mt-1 font-display text-2xl">{current.concept.title}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-500"
                      style={{ width: `${(conceptLevel / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold nums opacity-90">
                    {Math.round((conceptLevel / 5) * 100)}%
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 font-bold">
                  {started ? "Continuar" : "Empezar"}
                  <ChevronRight className="h-5 w-5" />
                </span>
              </div>
              <div className="hidden shrink-0 sm:block">
                <MascotFull size={140} />
              </div>
            </div>
          </Link>
        );
      })()}

      {/* Resumen breve */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniStat label="Preparación" value={`${readiness}%`} />
        <MiniStat label="Nivel" value={`${progress.level}`} sub={levelName(progress.level)} />
        <MiniStat label="Para el ingreso" value={`${days}`} sub="días" />
      </div>

      {/* Tipos de sesión (secundario) */}
      <section className="mt-7">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg text-ink">O elegí otro tipo de sesión</h2>
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
                className="group flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5"
              >
                <Tile icon={Icon} tone={info.tone} size={50} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-[16px] text-ink">{info.label}</p>
                    {dueCount != null && dueCount > 0 && <Badge tone="warn">{dueCount}</Badge>}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{info.blurb}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-surface p-3 text-center shadow-card">
      <p className="font-display text-xl text-ink nums">{value}</p>
      <p className="text-[11px] font-semibold text-ink-muted">{sub ?? label}</p>
    </div>
  );
}
