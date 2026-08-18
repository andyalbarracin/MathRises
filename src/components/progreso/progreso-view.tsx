"use client";

import { useEffect, useState } from "react";
import { ChartLine, Zap, Target, Clock, CircleCheckBig, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { repository } from "@/data/local/repository";
import type { ConceptMastery, DailySession, ReviewSchedule } from "@/domain/types";
import { PLAYABLE, PLAYABLE_ORDER } from "@/content/concepts";
import { MODULE_LABEL } from "@/content/mock-exams";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";

const DAY = 86_400_000;

interface WeekStats {
  sessions: number;
  exercises: number;
  correct: number;
  minutes: number;
  xp: number;
}

function summarize(sessions: DailySession[]): WeekStats {
  return sessions.reduce<WeekStats>(
    (acc, s) => ({
      sessions: acc.sessions + 1,
      exercises: acc.exercises + s.totalCount,
      correct: acc.correct + s.correctCount,
      minutes: acc.minutes + s.durationMs / 60_000,
      xp: acc.xp + s.xpEarned,
    }),
    { sessions: 0, exercises: 0, correct: 0, minutes: 0, xp: 0 },
  );
}

interface Data {
  sessions: DailySession[];
  masteries: ConceptMastery[];
  reviews: ReviewSchedule[];
  now: number;
}

export function ProgresoView() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [sessions, masteries, reviews] = await Promise.all([
        repository.getAllSessions(),
        repository.getAllMasteries(),
        repository.getAllReviews(),
      ]);
      if (alive) setData({ sessions, masteries, reviews, now: Date.now() });
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!data) return null;

  const done = data.sessions.filter((s) => s.completedAt !== null);
  if (done.length === 0) {
    return (
      <>
        <Header />
        <EmptyState
          icon={ChartLine}
          title="Sin datos suficientes todavía"
          description="Completá algunas sesiones para ver tu evolución, tus conceptos fuertes y los que necesitan repaso."
        />
      </>
    );
  }

  const now = data.now;
  const thisWeek = summarize(done.filter((s) => (s.completedAt ?? 0) > now - 7 * DAY));
  const lastWeek = summarize(done.filter((s) => {
    const t = s.completedAt ?? 0;
    return t <= now - 7 * DAY && t > now - 14 * DAY;
  }));

  const masteryBy = new Map(data.masteries.map((m) => [m.conceptId, m.level]));

  // Dominio por módulo (agrupado por etiqueta visible).
  const groups = new Map<string, { mastered: number; total: number; sumLevel: number }>();
  for (const id of PLAYABLE_ORDER) {
    const label = MODULE_LABEL[PLAYABLE[id].concept.module];
    const g = groups.get(label) ?? { mastered: 0, total: 0, sumLevel: 0 };
    const level = masteryBy.get(id) ?? 0;
    g.total += 1;
    g.sumLevel += level;
    if (level >= 4) g.mastered += 1;
    groups.set(label, g);
  }
  const modules = [...groups.entries()]
    .map(([label, g]) => ({ label, ...g, avg: g.sumLevel / g.total }))
    .sort((a, b) => b.avg - a.avg);

  const dueNow = data.reviews.filter((r) => r.nextReviewAt <= now).length;
  const dueSoon = data.reviews.filter((r) => r.nextReviewAt > now && r.nextReviewAt <= now + 7 * DAY).length;

  const acc = thisWeek.exercises > 0 ? Math.round((thisWeek.correct / thisWeek.exercises) * 100) : 0;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Resumen semanal */}
        <section className="rounded-2xl bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Tu semana</h2>
            <span className="text-xs text-ink-muted">Últimos 7 días</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={CircleCheckBig} label="Sesiones" value={String(thisWeek.sessions)} delta={diff(thisWeek.sessions, lastWeek.sessions)} />
            <Stat icon={Target} label="Ejercicios" value={String(thisWeek.exercises)} delta={diff(thisWeek.exercises, lastWeek.exercises)} />
            <Stat icon={Zap} label="XP" value={String(thisWeek.xp)} delta={diff(thisWeek.xp, lastWeek.xp)} />
            <Stat icon={Clock} label="Minutos" value={String(Math.round(thisWeek.minutes))} delta={diff(Math.round(thisWeek.minutes), Math.round(lastWeek.minutes))} />
          </div>
          <div className="mt-4 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-ink">Precisión de la semana</span>
              <span className="font-bold text-ink nums">{acc}%</span>
            </div>
            <Progress value={acc} className="mt-2" />
          </div>
        </section>

        {/* Dominio por módulo */}
        <section className="rounded-2xl bg-surface p-5 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Dominio por módulo</h2>
          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-bold text-ink">{m.label}</span>
                  <span className="text-ink-muted nums">
                    {m.mastered}/{m.total} dominados
                  </span>
                </div>
                <Progress value={(m.avg / 5) * 100} />
              </div>
            ))}
          </div>
        </section>

        {/* Retención */}
        <section className="rounded-2xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <RefreshCw className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Retención (repaso espaciado)</p>
              <p className="text-xs text-ink-muted">
                {dueNow > 0
                  ? `${dueNow} ${dueNow === 1 ? "concepto listo" : "conceptos listos"} para repasar hoy.`
                  : "Nada pendiente por ahora. ¡Al día!"}
                {dueSoon > 0 && ` ${dueSoon} en los próximos 7 días.`}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Header() {
  return (
    <PageHeader
      title="Progreso"
      subtitle="Tu preparación para el ingreso: dominio por módulo, precisión, retención y tendencia."
    />
  );
}

function diff(a: number, b: number): number {
  return a - b;
}

function Stat({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  delta: number;
}) {
  const Trend = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const tone = delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-ink-muted";
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <Icon className="h-4 w-4 text-ink-muted" />
      <p className="mt-2 font-display text-2xl font-bold text-ink nums">{value}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-muted">{label}</span>
        <span className={`inline-flex items-center gap-0.5 text-xs font-bold nums ${tone}`}>
          <Trend className="h-3 w-3" />
          {delta > 0 ? `+${delta}` : delta < 0 ? delta : ""}
        </span>
      </div>
    </div>
  );
}
