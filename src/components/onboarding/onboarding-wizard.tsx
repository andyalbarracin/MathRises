"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Target } from "lucide-react";
import { repository } from "@/data/local/repository";
import { subscribeCloud, getCloudState } from "@/lib/cloud-sync";
import { AccountCard } from "@/components/cloud/account-card";
import { scoreDiagnostic, buildSeedMasteries, type AreaResult } from "@/domain/diagnostic";
import { TARGET_DATE } from "@/content/roadmap";
import { daysUntil } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/nav/brand-mark";
import { Mascot } from "@/components/art/mascot";
import { HillsScene } from "@/components/art/scenes";
import { Reveal } from "@/components/motion/reveal";
import { DiagnosticRunner } from "./diagnostic-runner";
import { StartingPoint } from "./starting-point";
import { cn } from "@/lib/utils";

type Phase = "meta" | "diagnostic" | "results";

interface Meta {
  name: string;
  targetDate: string;
  weeklyHours: number;
  studyDays: number[];
}

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
const META_STEPS = 6;

export function OnboardingWizard() {
  const router = useRouter();
  const cloud = useSyncExternalStore(subscribeCloud, getCloudState, getCloudState);
  // Si el usuario inicia sesión acá (transición sin→con email), su progreso en
  // la nube se sincroniza y lo llevamos a la app.
  const startedLoggedIn = useRef(getCloudState().email);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  useEffect(() => {
    if (!startedLoggedIn.current && cloud.email) setJustLoggedIn(true);
  }, [cloud.email]);
  useEffect(() => {
    if (!justLoggedIn) return;
    const t = setTimeout(() => router.replace("/"), 1500);
    return () => clearTimeout(t);
  }, [justLoggedIn, router]);

  const [phase, setPhase] = useState<Phase>("meta");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<AreaResult[] | null>(null);
  const [meta, setMeta] = useState<Meta>({
    name: "",
    targetDate: TARGET_DATE,
    weeklyHours: 4,
    studyDays: [2, 3, 4, 6, 0],
  });

  function next() {
    if (step + 1 >= META_STEPS) setPhase("diagnostic");
    else setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  function onDiagnosticDone(answers: Record<string, string>) {
    setResults(scoreDiagnostic(answers));
    setPhase("results");
  }

  async function persist(finalResults: AreaResult[] | null) {
    setSaving(true);
    const now = Date.now();
    await repository.saveProfile({
      id: "me",
      name: meta.name.trim() || "Estudiante",
      targetDate: meta.targetDate,
      weeklyHours: meta.weeklyHours,
      studyDays: meta.studyDays,
      createdAt: now,
    });
    if (finalResults) {
      await repository.saveDiagnostic({
        id: "me",
        results: finalResults.map((r) => ({
          area: r.area,
          label: r.label,
          correct: r.correct,
          total: r.total,
        })),
        completedAt: now,
      });
      await repository.bulkUpsertMastery(buildSeedMasteries(finalResults));
    }
    const prog = await repository.getProgress();
    await repository.saveProgress({
      ...prog,
      onboardingComplete: true,
      weeklyGoalMinutes: meta.weeklyHours * 60,
    });
    router.replace("/");
  }

  const overall =
    phase === "results" ? 100 : phase === "diagnostic" ? 70 : (step / META_STEPS) * 55;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-4 px-4 py-4 md:px-8">
        <BrandMark />
        <div className="ml-2 hidden h-2 max-w-xs flex-1 overflow-hidden rounded-full bg-surface-2 sm:block">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${overall}%` }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full flex-1 flex-col justify-center px-5 py-8">
        {phase === "meta" && (
          <MetaStep key={step} step={step} meta={meta} setMeta={setMeta} onNext={next} onBack={back} onSkipDiag={() => persist(null)} />
        )}
        {phase === "diagnostic" && (
          <DiagnosticRunner onComplete={onDiagnosticDone} onSkip={() => persist(null)} />
        )}
        {phase === "results" && results && (
          <StartingPoint results={results} onFinish={() => persist(results)} saving={saving} />
        )}
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function MetaStep({
  step,
  meta,
  setMeta,
  onNext,
  onBack,
  onSkipDiag,
}: {
  step: number;
  meta: Meta;
  setMeta: (m: Meta) => void;
  onNext: () => void;
  onBack: () => void;
  onSkipDiag: () => void;
}) {
  const [showLogin, setShowLogin] = useState(false);

  if (step === 0) {
    return (
      <Reveal className="mx-auto w-full max-w-md text-center" stagger>
        <div className="relative mx-auto mb-2 h-40 w-full max-w-xs overflow-hidden rounded-3xl">
          <HillsScene className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-0 bottom-1 grid place-items-center">
            <Mascot tone="violet" expression="cheer" symbol="+" size={110} />
          </div>
        </div>
        <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl">
          Tu camino a Ingeniería empieza acá
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-muted">
          RiseMath arma un plan a tu medida para llegar al ingreso de la UNLaM, en sesiones cortas y
          sostenidas. Sin apuro, con método.
        </p>
        <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={onNext}>
          Empezar
          <ArrowRight className="h-5 w-5" />
        </Button>

        <div className="mt-8 border-t border-border pt-6">
          {showLogin ? (
            <div className="mx-auto max-w-sm text-left">
              <AccountCard />
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              ¿Ya tenés una cuenta?{" "}
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="font-bold text-accent hover:underline"
              >
                Iniciá sesión
              </button>{" "}
              y recuperá tu progreso.
            </p>
          )}
        </div>
      </Reveal>
    );
  }

  if (step === 1) {
    return (
      <Shell icon={Target} title="¿Cómo querés que te llamemos?" subtitle="Tu objetivo: Ingeniería Industrial, UNLaM 2027." onNext={onNext} onBack={onBack}>
        <input
          autoFocus
          value={meta.name}
          onChange={(e) => setMeta({ ...meta, name: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onNext()}
          placeholder="Tu nombre"
          maxLength={40}
          className="w-full rounded-2xl border-2 border-border bg-surface px-4 py-3.5 text-lg outline-none transition-colors focus:border-accent"
        />
      </Shell>
    );
  }

  if (step === 2) {
    const days = daysUntil(meta.targetDate);
    return (
      <Shell icon={Calendar} title="¿Para cuándo es el ingreso?" subtitle="La fecha marca el ritmo del plan. Podés ajustarla después." onNext={onNext} onBack={onBack}>
        <input
          type="date"
          value={meta.targetDate}
          onChange={(e) => setMeta({ ...meta, targetDate: e.target.value })}
          className="nums w-full rounded-2xl border-2 border-border bg-surface px-4 py-3.5 text-lg outline-none transition-colors focus:border-accent"
        />
        {days > 0 && (
          <p className="mt-3 text-sm text-ink-muted">
            Faltan <span className="font-bold text-ink nums">{days}</span> días. Tiempo de sobra si sos
            constante.
          </p>
        )}
      </Shell>
    );
  }

  if (step === 3) {
    return (
      <Shell icon={Clock} title="¿Cuántas horas por semana?" subtitle="Preferí algo que puedas sostener todas las semanas." onNext={onNext} onBack={onBack}>
        <div className="grid grid-cols-4 gap-2.5">
          {HOURS.map((h) => {
            const active = meta.weeklyHours === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setMeta({ ...meta, weeklyHours: h })}
                className={cn(
                  "rounded-2xl border-2 px-3 py-4 text-center transition-all active:translate-y-0.5",
                  active ? "border-accent bg-accent-soft text-ink" : "border-border bg-surface text-ink-muted hover:border-accent/40",
                )}
              >
                <span className="font-display text-xl nums">{h === 8 ? "8+" : h}</span>
                <span className="mt-0.5 block text-xs font-semibold">horas</span>
              </button>
            );
          })}
        </div>
      </Shell>
    );
  }

  if (step === 4) {
    function toggleDay(n: number) {
      const has = meta.studyDays.includes(n);
      setMeta({ ...meta, studyDays: has ? meta.studyDays.filter((d) => d !== n) : [...meta.studyDays, n] });
    }
    return (
      <Shell icon={Calendar} title="¿Qué días te vienen bien?" subtitle="Elegí los días en los que vas a estudiar." onNext={onNext} onBack={onBack} nextDisabled={meta.studyDays.length === 0}>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => {
            const active = meta.studyDays.includes(d.n);
            return (
              <button
                key={d.n}
                type="button"
                onClick={() => toggleDay(d.n)}
                className={cn(
                  "min-w-14 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold transition-all active:translate-y-0.5",
                  active ? "border-accent bg-accent-soft text-ink" : "border-border bg-surface text-ink-muted hover:border-accent/40",
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </Shell>
    );
  }

  // step 5: intro diagnóstico (con skip)
  return (
    <Reveal className="mx-auto w-full max-w-md text-center" stagger>
      <div className="mx-auto w-fit">
        <Mascot tone="blue" expression="think" symbol="?" size={96} />
      </div>
      <h1 className="mt-4 font-display text-2xl text-ink md:text-3xl">Un diagnóstico corto</h1>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-muted">
        Son 30 preguntas rápidas de varios temas. No hay nota ni tiempo: sirven para saber qué ya
        manejás y por dónde conviene empezar.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Button size="lg" className="w-full" onClick={onNext}>
          Empezar diagnóstico
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Button>
          <Button variant="ghost" onClick={onSkipDiag}>
            Saltar por ahora
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

function Shell({
  icon: Icon,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextDisabled,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <Reveal className="mx-auto w-full max-w-md" stagger>
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h1 className="font-display text-2xl text-ink md:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
      <div className="mt-6">{children}</div>
      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>
        <Button onClick={onNext} disabled={nextDisabled}>
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Reveal>
  );
}
