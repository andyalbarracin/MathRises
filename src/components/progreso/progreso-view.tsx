"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import {
  ChartLine,
  Zap,
  Flame,
  Target,
  Clock,
  CircleCheckBig,
  TrendingUp,
  TrendingDown,
  Minus,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { repository } from "@/data/local/repository";
import type {
  ConceptMastery,
  DailySession,
  DiagnosticSummary,
  Profile,
  ReviewSchedule,
  UserProgress,
} from "@/domain/types";
import { levelName } from "@/domain/xp";
import { masteryStars } from "@/domain/mastery";
import { computeAchievements, type AchievementStats } from "@/domain/achievements";
import { LABEL_TEXT, type StartingLabel } from "@/domain/diagnostic";
import { AREAS, type DiagnosticArea } from "@/content/diagnostic";
import { PLAYABLE, PLAYABLE_ORDER } from "@/content/concepts";
import { MODULE_LABEL } from "@/content/mock-exams";
import { ROADMAP, TARGET_DATE } from "@/content/roadmap";
import { daysUntil, todayStr } from "@/lib/date";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const TOTAL_NODES = ROADMAP.reduce((acc, s) => acc + s.nodes.length, 0);

const TONE: Record<StartingLabel, "success" | "warn" | "danger" | "neutral"> = {
  solid: "success",
  review: "warn",
  fragile: "danger",
  unseen: "neutral",
};

interface WeekAgg {
  sessions: number;
  exercises: number;
  correct: number;
  minutes: number;
  xp: number;
}
function aggregate(sessions: DailySession[]): WeekAgg {
  return sessions.reduce<WeekAgg>(
    (a, s) => ({
      sessions: a.sessions + 1,
      exercises: a.exercises + s.totalCount,
      correct: a.correct + s.correctCount,
      minutes: a.minutes + s.durationMs / 60_000,
      xp: a.xp + s.xpEarned,
    }),
    { sessions: 0, exercises: 0, correct: 0, minutes: 0, xp: 0 },
  );
}

interface Data {
  profile?: Profile;
  progress: UserProgress;
  masteries: ConceptMastery[];
  sessions: DailySession[];
  diagnostic?: DiagnosticSummary;
  reviews: ReviewSchedule[];
  now: number;
}

export function ProgresoView() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [profile, progress, masteries, sessions, diagnostic, reviews] = await Promise.all([
        repository.getProfile(),
        repository.getProgress(),
        repository.getAllMasteries(),
        repository.getAllSessions(),
        repository.getDiagnostic(),
        repository.getAllReviews(),
      ]);
      if (alive) setData({ profile, progress, masteries, sessions, diagnostic, reviews, now: Date.now() });
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-3xl bg-surface-2/60" />;
  }

  const { progress, masteries, diagnostic, reviews, profile, now } = data;
  const sessions = data.sessions.filter((s) => s.completedAt != null);

  if (sessions.length === 0) {
    return (
      <>
        <PageHeader title="Progreso" subtitle="Tu preparación para el ingreso: dominio, precisión, retención y tendencia." />
        <EmptyState
          icon={ChartLine}
          title="Sin datos suficientes todavía"
          description="Completá algunas sesiones para ver tu evolución, tus temas fuertes y los que necesitan repaso."
        />
      </>
    );
  }

  // --- Métricas globales ---
  const totalExercises = sessions.reduce((a, s) => a + s.totalCount, 0);
  const totalCorrect = sessions.reduce((a, s) => a + s.correctCount, 0);
  const accuracy = totalExercises > 0 ? totalCorrect / totalExercises : 0;
  const studyMinutes = Math.round(sessions.reduce((a, s) => a + s.durationMs, 0) / 60_000);
  const conceptsMastered = masteries.filter((m) => m.level >= 4).length;
  const sumLevels = masteries.reduce((a, m) => a + m.level, 0);
  const readiness = Math.round((sumLevels / (5 * TOTAL_NODES)) * 100);
  const days = daysUntil(profile?.targetDate ?? TARGET_DATE);

  // --- Semana: barras por día + tendencia vs. semana anterior ---
  const nowDate = new Date(now);
  const week: { day: string; min: number }[] = [];
  const last7 = new Set<string>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(nowDate);
    d.setDate(nowDate.getDate() - i);
    const key = todayStr(d);
    last7.add(key);
    const min = Math.round(
      sessions.filter((s) => s.date === key).reduce((a, s) => a + s.durationMs / 60_000, 0),
    );
    week.push({ day: DAY_NAMES[d.getDay()], min });
  }
  const thisWeek = aggregate(sessions.filter((s) => (s.completedAt ?? 0) > now - 7 * DAY));
  const lastWeek = aggregate(
    sessions.filter((s) => {
      const t = s.completedAt ?? 0;
      return t <= now - 7 * DAY && t > now - 14 * DAY;
    }),
  );
  const weekAcc = thisWeek.exercises > 0 ? Math.round((thisWeek.correct / thisWeek.exercises) * 100) : 0;

  // --- Ritmo ---
  const sessionsThisWeek = sessions.filter((s) => last7.has(s.date)).length;
  const weeklyTarget = Math.max(3, profile?.studyDays.length ?? 4);
  const deficit = Math.max(0, weeklyTarget - sessionsThisWeek);
  const paceStatus: "ahead" | "ontrack" | "behind" =
    deficit > 0 ? "behind" : sessionsThisWeek > weeklyTarget ? "ahead" : "ontrack";

  // --- Dominio por módulo ---
  const masteryBy = new Map(masteries.map((m) => [m.conceptId, m.level]));
  const groups = new Map<string, { mastered: number; total: number; sum: number }>();
  for (const id of PLAYABLE_ORDER) {
    const label = MODULE_LABEL[PLAYABLE[id].concept.module];
    const g = groups.get(label) ?? { mastered: 0, total: 0, sum: 0 };
    const level = masteryBy.get(id) ?? 0;
    g.total += 1;
    g.sum += level;
    if (level >= 4) g.mastered += 1;
    groups.set(label, g);
  }
  const modules = [...groups.entries()]
    .map(([label, g]) => ({ label, ...g, avg: g.sum / g.total }))
    .sort((a, b) => b.avg - a.avg);

  const dueNow = reviews.filter((r) => r.nextReviewAt <= now).length;
  const dueSoon = reviews.filter((r) => r.nextReviewAt > now && r.nextReviewAt <= now + 7 * DAY).length;

  const stats: AchievementStats = {
    xp: progress.xp,
    level: progress.level,
    streak: progress.streak,
    sessions: sessions.length,
    exercises: totalExercises,
    accuracy,
    conceptsMastered,
    studyMinutes,
  };
  const achievements = computeAchievements(stats);
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <>
      <PageHeader title="Progreso" subtitle="Tu preparación para el ingreso: dominio, precisión, retención y tendencia." />

      <div className="mx-auto max-w-3xl space-y-6">
        <PaceCard
          status={paceStatus}
          deficit={deficit}
          weeklyTarget={weeklyTarget}
          sessionsThisWeek={sessionsThisWeek}
          days={days}
          readiness={readiness}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile icon={Zap} label="XP" value={String(progress.xp)} />
          <StatTile icon={Flame} label="Racha" value={`${progress.streak}d`} />
          <StatTile icon={Target} label="Precisión" value={`${Math.round(accuracy * 100)}%`} />
          <StatTile icon={CircleCheckBig} label="Ejercicios" value={String(totalExercises)} />
          <StatTile icon={TrendingUp} label="Nivel" value={String(progress.level)} sub={levelName(progress.level)} />
          <StatTile icon={Clock} label="Tiempo" value={`${studyMinutes}m`} />
          <StatTile icon={GraduationCap} label="Temas dominados" value={String(conceptsMastered)} />
          <StatTile icon={Target} label="Preparación" value={`${readiness}%`} />
        </div>

        {/* Tu semana: tendencia + barras + precisión */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Tu semana</h2>
            <span className="text-xs text-ink-muted">Últimos 7 días</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <TrendStat icon={CircleCheckBig} label="Sesiones" value={thisWeek.sessions} prev={lastWeek.sessions} />
            <TrendStat icon={Target} label="Ejercicios" value={thisWeek.exercises} prev={lastWeek.exercises} />
            <TrendStat icon={Zap} label="XP" value={thisWeek.xp} prev={lastWeek.xp} />
            <TrendStat icon={Clock} label="Minutos" value={Math.round(thisWeek.minutes)} prev={Math.round(lastWeek.minutes)} />
          </div>
          <div className="mt-5 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--ink-muted)", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "var(--surface-2)" }}
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--ink)" }}
                  formatter={(v) => [`${v} min`, "Estudio"] as [string, string]}
                />
                <Bar dataKey="min" radius={[8, 8, 8, 8]} maxBarSize={34}>
                  {week.map((d, i) => (
                    <Cell key={i} fill={d.min > 0 ? "var(--accent)" : "var(--surface-2)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-ink">Precisión de la semana</span>
              <span className="font-bold text-ink nums">{weekAcc}%</span>
            </div>
            <Progress value={weekAcc} className="mt-2" />
          </div>
        </section>

        {/* Dominio por módulo */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg text-ink">Dominio por módulo</h2>
          <div className="space-y-3.5">
            {modules.map((m) => (
              <div key={m.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-bold text-ink">{m.label}</span>
                  <span className="text-ink-muted nums">{m.mastered}/{m.total} dominados</span>
                </div>
                <Progress value={(m.avg / 5) * 100} />
              </div>
            ))}
          </div>
        </section>

        {/* Dominio por tema (detalle) */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg text-ink">Dominio por tema</h2>
          <ul className="space-y-3.5">
            {PLAYABLE_ORDER.map((id) => {
              const p = PLAYABLE[id];
              const level = masteryBy.get(id) ?? 0;
              return (
                <li key={id} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-sm text-ink">{p.concept.title}</span>
                  <Progress value={(level / 5) * 100} />
                  <span className="w-16 shrink-0 text-right text-xs text-c-amber">{masteryStars(level)}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Retención */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
              <RefreshCw className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base text-ink">Retención (repaso espaciado)</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                {dueNow > 0
                  ? `${dueNow} ${dueNow === 1 ? "tema listo" : "temas listos"} para repasar hoy.`
                  : "Nada pendiente por ahora. ¡Al día!"}
                {dueSoon > 0 && ` ${dueSoon} en los próximos 7 días.`}
              </p>
            </div>
          </div>
        </section>

        {/* Logros */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg text-ink">Logros</h2>
            <span className="text-sm font-bold text-ink-muted nums">{earnedCount}/{achievements.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {achievements.map(({ achievement: a, earned }) => (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3.5",
                  earned ? "border-accent/30 bg-accent-soft/50" : "border-border bg-surface-2/40 opacity-60",
                )}
              >
                <span className={cn("text-2xl", !earned && "grayscale")}>{a.emoji}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{a.title}</p>
                  <p className="truncate text-xs text-ink-muted">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Punto de partida */}
        {diagnostic && (
          <section className="rounded-3xl bg-surface p-6 shadow-card">
            <h2 className="font-display text-lg text-ink">Tu punto de partida</h2>
            <p className="mt-0.5 text-sm text-ink-muted">Según el diagnóstico inicial.</p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {diagnostic.results.map((r) => {
                const info = AREAS[r.area as DiagnosticArea];
                if (!info) return null;
                return (
                  <li key={r.area} className="flex items-center gap-3">
                    <span aria-hidden>{info.emoji}</span>
                    <span className="flex-1 text-sm text-ink">{info.label}</span>
                    <Badge tone={TONE[r.label as StartingLabel]}>{LABEL_TEXT[r.label as StartingLabel]}</Badge>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

function PaceCard({
  status,
  deficit,
  weeklyTarget,
  sessionsThisWeek,
  days,
  readiness,
}: {
  status: "ahead" | "ontrack" | "behind";
  deficit: number;
  weeklyTarget: number;
  sessionsThisWeek: number;
  days: number;
  readiness: number;
}) {
  const meta = {
    ahead: { label: "Adelantado", emoji: "🚀", tone: "bg-c-green-soft text-c-green" },
    ontrack: { label: "En ritmo", emoji: "✅", tone: "bg-success-soft text-success" },
    behind: { label: "Atrasado", emoji: "⏳", tone: "bg-c-amber-soft text-c-amber" },
  }[status];

  const message =
    status === "behind"
      ? `Necesitás ${deficit} ${deficit === 1 ? "sesión" : "sesiones"} más esta semana para volver al ritmo.`
      : status === "ahead"
        ? "¡Vas adelantado! Ya superaste tu meta semanal. Seguí así."
        : `Vas al día con tu plan de ${weeklyTarget} sesiones por semana.`;

  return (
    <section className="rounded-3xl bg-surface p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold", meta.tone)}>
          <span>{meta.emoji}</span> {meta.label}
        </span>
        <span className="text-sm text-ink-muted">
          <span className="font-bold text-ink nums">{days}</span> días para el ingreso
        </span>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink">{message}</p>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
          <span>Esta semana</span>
          <span className="nums">{sessionsThisWeek}/{weeklyTarget} sesiones</span>
        </div>
        <Progress value={(sessionsThisWeek / weeklyTarget) * 100} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Preparación general para el ingreso: <span className="font-bold text-ink nums">{readiness}%</span> (indicador
        motivacional, no es una predicción oficial).
      </p>
    </section>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-card">
      <Icon className="h-4 w-4 text-ink-muted" />
      <p className="mt-2 font-display text-xl text-ink nums">{value}</p>
      <p className="truncate text-[11px] font-semibold text-ink-muted">{sub ?? label}</p>
    </div>
  );
}

function TrendStat({
  icon: Icon,
  label,
  value,
  prev,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  prev: number;
}) {
  const delta = value - prev;
  const Trend = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const tone = delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-ink-muted";
  return (
    <div className="rounded-2xl bg-surface-2/50 p-3.5">
      <Icon className="h-4 w-4 text-ink-muted" />
      <p className="mt-2 font-display text-2xl text-ink nums">{value}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-muted">{label}</span>
        <span className={cn("inline-flex items-center gap-0.5 text-xs font-bold nums", tone)}>
          <Trend className="h-3 w-3" />
          {delta > 0 ? `+${delta}` : delta < 0 ? delta : ""}
        </span>
      </div>
    </div>
  );
}
