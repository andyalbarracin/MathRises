"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, GraduationCap, CalendarDays } from "lucide-react";
import { repository } from "@/data/local/repository";
import type { DiagnosticSummary, Profile } from "@/domain/types";
import { LABEL_TEXT, type StartingLabel } from "@/domain/diagnostic";
import { AREAS, type DiagnosticArea } from "@/content/diagnostic";
import { daysUntil } from "@/lib/date";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";

const DAY_LABEL: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};

const TONE: Record<StartingLabel, "success" | "warn" | "danger" | "neutral"> = {
  solid: "success",
  review: "warn",
  fragile: "danger",
  unseen: "neutral",
};

export function ProfileView() {
  const [data, setData] = useState<{ profile?: Profile; diagnostic?: DiagnosticSummary } | null>(
    null,
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      const [profile, diagnostic] = await Promise.all([
        repository.getProfile(),
        repository.getDiagnostic(),
      ]);
      if (alive) setData({ profile, diagnostic });
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface/50" />;
  }

  const { profile, diagnostic } = data;

  if (!profile) {
    return (
      <>
        <PageHeader title="Perfil" />
        <EmptyState
          icon={GraduationCap}
          title="Todavía no configuraste tu plan"
          description="Completá el onboarding para definir tu meta, tu ritmo semanal y tu punto de partida."
        />
        <div className="mt-4">
          <Link href="/onboarding" className="text-sm text-accent hover:underline">
            Empezar onboarding
          </Link>
        </div>
      </>
    );
  }

  const days = daysUntil(profile.targetDate);
  const sortedDays = [...profile.studyDays].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));

  return (
    <>
      <PageHeader title={profile.name} subtitle="Ingeniería Industrial · UNLaM 2027" />

      <div className="mx-auto max-w-2xl">
        <dl className="grid gap-3 sm:grid-cols-3">
          <Fact icon={Calendar} label="Fecha meta" value={`${days} días`} sub={profile.targetDate} />
          <Fact icon={Clock} label="Ritmo" value={`${profile.weeklyHours} h`} sub="por semana" />
          <Fact
            icon={CalendarDays}
            label="Días de estudio"
            value={`${sortedDays.length} días`}
            sub={sortedDays.map((d) => DAY_LABEL[d]).join(" · ")}
          />
        </dl>

        {diagnostic && (
          <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium text-ink">Tu punto de partida</p>
            <p className="mt-1 text-xs text-ink-muted">Según el diagnóstico inicial.</p>
            <ul className="mt-4 space-y-2">
              {diagnostic.results.map((r) => {
                const info = AREAS[r.area as DiagnosticArea];
                if (!info) return null;
                return (
                  <li key={r.area} className="flex items-center gap-3">
                    <span aria-hidden>{info.emoji}</span>
                    <span className="flex-1 text-sm text-ink">{info.label}</span>
                    <Badge tone={TONE[r.label as StartingLabel]}>
                      {LABEL_TEXT[r.label as StartingLabel]}
                    </Badge>
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

function Fact({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <Icon className="h-4 w-4 text-ink-muted" />
      <p className="mt-2 text-xs text-ink-muted">{label}</p>
      <p className="font-display text-xl text-ink nums">{value}</p>
      <p className="text-xs text-ink-muted nums">{sub}</p>
    </div>
  );
}
