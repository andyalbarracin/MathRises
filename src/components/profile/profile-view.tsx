"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Target, ClipboardList, ChartLine, GraduationCap, Palette } from "lucide-react";
import { repository } from "@/data/local/repository";
import type { Profile } from "@/domain/types";
import { daysUntil } from "@/lib/date";
import { PageHeader } from "@/components/ui/page-header";
import { AccountCard } from "@/components/cloud/account-card";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { SoundToggle } from "@/components/nav/sound-toggle";
import { Button } from "@/components/ui/button";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function ProfileView() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await repository.getProfile();
      if (alive) setProfile(p ?? null);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (profile === undefined) {
    return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-3xl bg-surface-2/60" />;
  }

  const days = profile ? daysUntil(profile.targetDate) : 0;
  const studyDays = profile
    ? [...profile.studyDays].sort((a, b) => a - b).map((n) => DAY_NAMES[n]).join(" · ")
    : "";

  return (
    <>
      <PageHeader
        title={profile?.name ? profile.name : "Perfil"}
        subtitle="Tu cuenta, tu plan de estudio y las preferencias de la app."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Cuenta y sincronización */}
        <AccountCard />

        {/* Plan de estudio */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
              <ClipboardList className="h-5 w-5" />
            </span>
            <h2 className="font-display text-lg text-ink">Plan de estudio</h2>
          </div>

          {profile ? (
            <>
              <dl className="divide-y divide-border">
                <PlanRow icon={GraduationCap} label="Objetivo" value="Ingeniería Industrial · UNLaM 2027" />
                <PlanRow icon={Target} label="Días para el ingreso" value={`${days} días`} />
                <PlanRow icon={CalendarDays} label="Días de estudio" value={studyDays || "—"} />
                <PlanRow icon={Clock} label="Meta semanal" value={`${profile.weeklyHours} h`} />
              </dl>
              <div className="mt-5 rounded-2xl border border-border p-4">
                <p className="text-sm font-bold text-ink">Diagnóstico inicial</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-muted">
                  Rehacé el diagnóstico y ajustá tu plan (nombre, días y horas) cuando quieras.
                </p>
                <Link href="/onboarding" className="mt-3 inline-block">
                  <Button variant="outlined" size="sm">
                    Hacer diagnóstico inicial
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border p-4">
              <p className="text-[15px] leading-relaxed text-ink-muted">
                Todavía no configuraste tu plan. El diagnóstico inicial arma un recorrido a tu medida.
              </p>
              <Link href="/onboarding" className="mt-3 inline-block">
                <Button size="sm">Empezar diagnóstico</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Preferencias */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
              <Palette className="h-5 w-5" />
            </span>
            <h2 className="font-display text-lg text-ink">Preferencias</h2>
          </div>
          <div className="flex flex-col gap-1">
            <ThemeToggle />
            <SoundToggle />
          </div>
        </section>

        {/* Acceso al progreso */}
        <Link
          href="/progreso"
          className="md-state flex items-center gap-4 rounded-3xl bg-surface p-5 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
            <ChartLine className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base text-ink">Ver tu progreso</p>
            <p className="text-sm text-ink-muted">Dominio por tema, tendencia semanal, retención y logros.</p>
          </div>
        </Link>
      </div>
    </>
  );
}

function PlanRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="h-4 w-4 shrink-0 text-ink-muted" />
      <dt className="flex-1 text-sm text-ink-muted">{label}</dt>
      <dd className="text-right text-sm font-bold text-ink">{value}</dd>
    </div>
  );
}
