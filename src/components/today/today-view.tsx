"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Zap, Target, ChevronRight, RefreshCw, BookOpen } from "lucide-react";
import { repository } from "@/data/local/repository";
import { getDueReviews } from "@/domain/spaced-repetition";
import { levelName, levelProgress } from "@/domain/xp";
import type { ConceptMastery, ReviewSchedule, UserProgress } from "@/domain/types";
import { ROADMAP } from "@/content/roadmap";
import { FRACCIONES_CONCEPT_ID } from "@/content/fractions";
import { daysUntil } from "@/lib/date";
import { TARGET_DATE } from "@/content/roadmap";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
      setState({
        progress,
        masteries,
        dueReviews: getDueReviews(reviews),
        name: profile?.name ?? "",
      });
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  if (!state) {
    return <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface/50" />;
  }

  const { progress, masteries, dueReviews, name } = state;
  const firstName = name.split(" ")[0];
  const fracMastery = masteries.find((m) => m.conceptId === FRACCIONES_CONCEPT_ID);
  const fracLevel = fracMastery?.level ?? 0;
  const sumLevels = masteries.reduce((a, m) => a + m.level, 0);
  const readiness = Math.round((sumLevels / (5 * TOTAL_NODES)) * 100);
  const lp = levelProgress(progress.xp);
  const days = daysUntil(TARGET_DATE);
  const isNewConcept = fracLevel === 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
            {greeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Faltan <span className="text-ink nums">{days}</span> días para el ingreso · UNLaM 2027
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={progress.streak > 0 ? "warn" : "neutral"}>
            <Flame className="h-3.5 w-3.5" />
            {progress.streak} {progress.streak === 1 ? "día" : "días"}
          </Badge>
          <Badge tone="accent">
            <Zap className="h-3.5 w-3.5" />
            {progress.xp} XP
          </Badge>
        </div>
      </div>

      {/* Readiness */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              Preparación para el ingreso
            </p>
            <p className="mt-1 font-display text-4xl text-ink nums">{readiness}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink">Nivel {progress.level}</p>
            <p className="text-xs text-ink-muted">{levelName(progress.level)}</p>
          </div>
        </div>
        <Progress value={lp.pct * 100} className="mt-4" />
        <p className="mt-2 text-xs text-ink-muted">
          {lp.toNext} XP para el próximo nivel · indicador motivacional, no es una predicción
          oficial.
        </p>
      </div>

      {/* Plan de hoy */}
      <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-ink">Tu sesión de hoy</p>
          <span className="text-sm text-ink-muted">~15–20 min</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span className="flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-accent-2" />
            {dueReviews.length} repasos
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-accent" />
            {isNewConcept ? "1 concepto nuevo" : "Fracciones (en progreso)"}
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="h-4 w-4 text-ink-muted" />6 ejercicios
          </span>
        </div>

        <Button asChild size="lg" className="mt-5 w-full sm:w-auto">
          <Link href="/sesion?mode=STANDARD">
            Comenzar sesión
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>

        <div className="mt-3 flex gap-2 text-xs">
          <Link href="/sesion?mode=QUICK" className="text-ink-muted underline-offset-2 hover:text-ink hover:underline">
            Rápida (10 min)
          </Link>
          <span className="text-border">·</span>
          <Link href="/sesion?mode=DEEP" className="text-ink-muted underline-offset-2 hover:text-ink hover:underline">
            Profunda (35 min)
          </Link>
        </div>
      </div>

      {/* Posición en el roadmap */}
      <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">Estás en</p>
          <Link href="/roadmap" className="text-sm text-accent hover:underline">
            Ver roadmap
          </Link>
        </div>
        <p className="mt-1 font-medium text-ink">Fundamentos · Fracciones</p>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={(fracLevel / 5) * 100} />
          <span className="w-10 shrink-0 text-right text-sm text-ink-muted nums">
            {Math.round((fracLevel / 5) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
