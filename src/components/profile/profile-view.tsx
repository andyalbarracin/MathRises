"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, ChartLine, Palette, ClipboardCheck } from "lucide-react";
import { repository } from "@/data/local/repository";
import type { Profile } from "@/domain/types";
import { daysUntil } from "@/lib/date";
import { TARGET_DATE } from "@/content/roadmap";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/skeleton";
import { AccountCard } from "@/components/cloud/account-card";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { SoundToggle } from "@/components/nav/sound-toggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

// Orden de la semana (n = getDay JS: 0=Dom … 6=Sáb).
const DAYS = [
  { n: 1, label: "Lun" },
  { n: 2, label: "Mar" },
  { n: 3, label: "Mié" },
  { n: 4, label: "Jue" },
  { n: 5, label: "Vie" },
  { n: 6, label: "Sáb" },
  { n: 0, label: "Dom" },
];
const HOURS = [2, 4, 6, 8];

export function ProfileView() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  // Formulario editable del plan.
  const [name, setName] = useState("");
  const [targetDate, setTargetDate] = useState(TARGET_DATE);
  const [studyDays, setStudyDays] = useState<number[]>([]);
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await repository.getProfile();
      if (!alive) return;
      setProfile(p ?? null);
      if (p) {
        setName(p.name);
        setTargetDate(p.targetDate);
        setStudyDays(p.studyDays);
        setWeeklyHours(p.weeklyHours);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  function toggleDay(n: number) {
    setStudyDays((prev) =>
      prev.includes(n) ? prev.filter((d) => d !== n) : [...prev, n],
    );
  }

  async function savePlan() {
    if (!profile) return;
    setSaving(true);
    const updated: Profile = {
      ...profile,
      name: name.trim() || "Estudiante",
      targetDate,
      studyDays: [...studyDays].sort((a, b) => a - b),
      weeklyHours,
    };
    await repository.saveProfile(updated);
    const prog = await repository.getProgress();
    await repository.saveProgress({ ...prog, weeklyGoalMinutes: weeklyHours * 60 });
    setProfile(updated);
    setSaving(false);
    toast({ emoji: "✅", title: "Plan actualizado", description: "Recalculamos tu ritmo y tus metas." });
  }

  if (profile === undefined) {
    return <PageSkeleton maxW="max-w-2xl" cards={3} />;
  }

  const days = daysUntil(targetDate);
  const dirty =
    !!profile &&
    (name !== profile.name ||
      targetDate !== profile.targetDate ||
      weeklyHours !== profile.weeklyHours ||
      [...studyDays].sort().join() !== [...profile.studyDays].sort().join());

  return (
    <>
      <PageHeader
        title={profile?.name ? profile.name : "Perfil"}
        subtitle="Tu cuenta, tu plan de estudio y las preferencias de la app."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Cuenta y sincronización */}
        <AccountCard />

        {/* Plan de estudio (editable) */}
        <section className="rounded-3xl bg-surface p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
              <ClipboardList className="h-5 w-5" />
            </span>
            <h2 className="font-display text-lg text-ink">Plan de estudio</h2>
          </div>

          {profile ? (
            <div className="space-y-5">
              <Field label="Cómo querés que te llamemos">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  placeholder="Tu nombre"
                  className="w-full rounded-2xl border-2 border-border bg-surface px-4 py-3 outline-none transition-colors focus:border-accent"
                />
              </Field>

              <Field label="Fecha del ingreso" hint={`Faltan ${days} días`}>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-2xl border-2 border-border bg-surface px-4 py-3 outline-none transition-colors focus:border-accent"
                />
              </Field>

              <Field label="Días de estudio" hint={`${studyDays.length} por semana`}>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const on = studyDays.includes(d.n);
                    return (
                      <button
                        key={d.n}
                        type="button"
                        onClick={() => toggleDay(d.n)}
                        aria-pressed={on}
                        className={cn(
                          "md-state h-11 w-12 rounded-2xl border-2 text-sm font-bold transition-colors",
                          on
                            ? "border-accent bg-accent-soft text-on-primary-container"
                            : "border-border text-ink-muted hover:text-ink",
                        )}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Meta semanal">
                <div className="flex flex-wrap gap-2">
                  {HOURS.map((h) => {
                    const on = weeklyHours === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setWeeklyHours(h)}
                        aria-pressed={on}
                        className={cn(
                          "md-state h-11 rounded-2xl border-2 px-5 text-sm font-bold transition-colors",
                          on
                            ? "border-accent bg-accent-soft text-on-primary-container"
                            : "border-border text-ink-muted hover:text-ink",
                        )}
                      >
                        {h} h
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Button
                className="w-full"
                disabled={!dirty || saving || studyDays.length === 0}
                onClick={savePlan}
              >
                {saving ? "Guardando…" : "Guardar cambios"}
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border p-5">
              <p className="text-[15px] leading-relaxed text-ink-muted">
                Todavía no configuraste tu plan. El diagnóstico inicial arma un recorrido a tu medida.
              </p>
              <Link href="/onboarding" className="mt-4 inline-block">
                <Button size="sm">Empezar diagnóstico</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Diagnóstico inicial */}
        {profile && (
          <section className="rounded-3xl bg-surface p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base text-ink">Diagnóstico inicial</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                    Rehacelo cuando quieras para recalibrar tu punto de partida.
                  </p>
                </div>
              </div>
              <Link href="/onboarding">
                <Button variant="outlined" size="sm">
                  Hacer diagnóstico
                </Button>
              </Link>
            </div>
          </section>
        )}

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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-bold text-ink">{label}</label>
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
