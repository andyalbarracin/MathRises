"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Flame, Zap, Target, Clock, CircleCheckBig, TrendingUp, GraduationCap } from "lucide-react";
import { repository } from "@/data/local/repository";
import type {
  ConceptMastery,
  DailySession,
  DiagnosticSummary,
  Profile,
  UserProgress,
} from "@/domain/types";
import { levelName } from "@/domain/xp";
import { masteryStars } from "@/domain/mastery";
import { computeAchievements, type AchievementStats } from "@/domain/achievements";
import { LABEL_TEXT, type StartingLabel } from "@/domain/diagnostic";
import { AREAS, type DiagnosticArea } from "@/content/diagnostic";
import { PLAYABLE, PLAYABLE_ORDER } from "@/content/concepts";
import { ROADMAP, TARGET_DATE } from "@/content/roadmap";
import { daysUntil, todayStr } from "@/lib/date";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { AccountCard } from "@/components/cloud/account-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const TOTAL_NODES = ROADMAP.reduce((acc, s) => acc + s.nodes.length, 0);

const TONE: Record<StartingLabel, "success" | "warn" | "danger" | "neutral"> = {
  solid: "success",
  review: "warn",
  fragile: "danger",
  unseen: "neutral",
};

interface Data {
  profile?: Profile;
  progress: UserProgress;
  masteries: ConceptMastery[];
  sessions: DailySession[];
  diagnostic?: DiagnosticSummary;
}

export function ProfileView() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [profile, progress, masteries, sessions, diagnostic] = await Promise.all([
        repository.getProfile(),
        repository.getProgress(),
        repository.getAllMasteries(),
        repository.getAllSessions(),
        repository.getDiagnostic(),
      ]);
      if (alive) setData({ profile, progress, masteries, sessions, diagnostic });
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-3xl bg-surface-2/60" />;
  }

  const { profile, progress, masteries, diagnostic } = data;
  // Solo sesiones efectivamente completadas cuentan para métricas.
  const sessions = data.sessions.filter((s) => s.completedAt != null);

  if (!profile) {
    return (
      <>
        <PageHeader title="Perfil" />
        <div className="mx-auto max-w-3xl space-y-6">
          <AccountCard />
          <EmptyState
            icon={GraduationCap}
            title="Todavía no configuraste tu plan"
            description="Completá el onboarding para ver tu tablero de progreso."
          />
          <div>
            <Link href="/onboarding" className="font-bold text-accent hover:underline">
              Empezar onboarding
            </Link>
          </div>
        </div>
      </>
    );
  }

  // --- Métricas ---
  const totalExercises = sessions.reduce((a, s) => a + s.totalCount, 0);
  const totalCorrect = sessions.reduce((a, s) => a + s.correctCount, 0);
  const accuracy = totalExercises > 0 ? totalCorrect / totalExercises : 0;
  const studyMinutes = Math.round(sessions.reduce((a, s) => a + s.durationMs, 0) / 60000);
  const conceptsMastered = masteries.filter((m) => m.level >= 4).length;
  const sumLevels = masteries.reduce((a, m) => a + m.level, 0);
  const readiness = Math.round((sumLevels / (5 * TOTAL_NODES)) * 100);
  const days = daysUntil(TARGET_DATE);

  // Actividad de la última semana
  const now = new Date();
  const week: { day: string; min: number }[] = [];
  const last7 = new Set<string>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = todayStr(d);
    last7.add(key);
    const min = Math.round(
      sessions.filter((s) => s.date === key).reduce((a, s) => a + s.durationMs / 60000, 0),
    );
    week.push({ day: DAY_NAMES[d.getDay()], min });
  }
  const sessionsThisWeek = sessions.filter((s) => last7.has(s.date)).length;
  const weeklyTarget = Math.max(3, profile.studyDays.length);
  const deficit = Math.max(0, weeklyTarget - sessionsThisWeek);
  const paceStatus: "ahead" | "ontrack" | "behind" =
    deficit > 0 ? "behind" : sessionsThisWeek > weeklyTarget ? "ahead" : "ontrack";

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
      <PageHeader title={profile.name} subtitle="Ingeniería Industrial · UNLaM 2027" />

      <div className="mx-auto max-w-3xl space-y-6">
        <AccountCard />
        {/* Ritmo */}
        <PaceCard
          status={paceStatus}
          deficit={deficit}
          weeklyTarget={weeklyTarget}
          sessionsThisWeek={sessionsThisWeek}
          days={days}
          readiness={readiness}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={Zap} label="XP" value={String(progress.xp)} />
          <Stat icon={Flame} label="Racha" value={`${progress.streak}d`} />
          <Stat icon={Target} label="Precisión" value={`${Math.round(accuracy * 100)}%`} />
          <Stat icon={CircleCheckBig} label="Ejercicios" value={String(totalExercises)} />
          <Stat icon={TrendingUp} label="Nivel" value={String(progress.level)} sub={levelName(progress.level)} />
          <Stat icon={Clock} label="Tiempo" value={`${studyMinutes}m`} />
          <Stat icon={GraduationCap} label="Temas dominados" value={String(conceptsMastered)} />
          <Stat icon={Target} label="Preparación" value={`${readiness}%`} />
        </div>

        {/* Actividad semanal */}
        <section className="rounded-2xl bg-surface p-5 shadow-card">
          <p className="font-display text-lg text-ink">Tu semana</p>
          <p className="text-sm text-ink-muted">Minutos de estudio por día</p>
          <div className="mt-4 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--surface-2)" }}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--ink)",
                  }}
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
        </section>

        {/* Dominio por tema */}
        <section className="rounded-2xl bg-surface p-5 shadow-card">
          <p className="font-display text-lg text-ink">Dominio por tema</p>
          <ul className="mt-4 space-y-3">
            {PLAYABLE_ORDER.map((id) => {
              const p = PLAYABLE[id];
              const level = masteries.find((m) => m.conceptId === id)?.level ?? 0;
              return (
                <li key={id} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-sm text-ink">{p.concept.title}</span>
                  <Progress value={(level / 5) * 100} />
                  <span className="w-16 shrink-0 text-right text-xs text-c-amber">
                    {masteryStars(level)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Logros */}
        <section className="rounded-2xl bg-surface p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-lg text-ink">Logros</p>
            <span className="text-sm font-bold text-ink-muted nums">
              {earnedCount}/{achievements.length}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {achievements.map(({ achievement: a, earned }) => (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3",
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
          <section className="rounded-2xl bg-surface p-5 shadow-card">
            <p className="font-display text-lg text-ink">Tu punto de partida</p>
            <p className="text-sm text-ink-muted">Según el diagnóstico inicial.</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
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
    <section className="rounded-2xl bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold", meta.tone)}>
          <span>{meta.emoji}</span> {meta.label}
        </span>
        <span className="text-sm text-ink-muted">
          <span className="font-bold text-ink nums">{days}</span> días para el ingreso
        </span>
      </div>
      <p className="mt-3 text-[15px] text-ink">{message}</p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-ink-muted">
          <span>Esta semana</span>
          <span className="nums">
            {sessionsThisWeek}/{weeklyTarget} sesiones
          </span>
        </div>
        <Progress value={(sessionsThisWeek / weeklyTarget) * 100} />
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        Preparación general para el ingreso: <span className="font-bold text-ink nums">{readiness}%</span> (indicador
        motivacional, no es una predicción oficial).
      </p>
    </section>
  );
}

function Stat({
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
