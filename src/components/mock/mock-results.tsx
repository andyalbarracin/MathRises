"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Clock, CircleHelp } from "lucide-react";
import type { MockExamResult } from "@/domain/types";
import { mentorClosing } from "@/content/mentors";
import { MentorMessage } from "@/components/mentors/mentor-avatar";
import { MascotFull } from "@/components/art/mascot";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function MockResults({ result }: { result: MockExamResult }) {
  const scoreRef = useRef<HTMLSpanElement>(null);
  const minutes = Math.max(1, Math.round(result.durationMs / 60000));
  const accuracy = result.total > 0 ? result.correct / result.total : 0;
  const closing = mentorClosing(accuracy);

  const priorities = [...result.breakdown]
    .filter((b) => b.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 3);

  useEffect(() => {
    const el = scoreRef.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: result.score,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
    });
    return () => {
      tween.kill();
    };
  }, [result.score]);

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <div className="mx-auto -mb-2 w-fit">
        <MascotFull pose={accuracy >= 0.6 ? "cheer" : "walk"} size={140} />
      </div>
      <p className="font-display text-2xl text-ink">Simulacro completo</p>
      <p className="text-sm text-ink-muted">{result.title}</p>

      <div className="mt-4 inline-flex items-baseline gap-1 rounded-full bg-accent-soft px-6 py-2">
        <span className="font-display text-5xl text-accent nums" ref={scoreRef}>0</span>
        <span className="font-display text-2xl text-accent">/100</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Aciertos" value={`${result.correct}/${result.total}`} />
        <Stat icon={CircleHelp} label="Sin responder" value={String(result.unanswered)} />
        <Stat icon={Clock} label="Tiempo" value={`${minutes}m`} />
      </div>

      <section className="mt-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-card">
        <p className="text-sm font-bold text-ink">Desglose por tema</p>
        <ul className="mt-3 space-y-2.5">
          {result.breakdown.map((b) => (
            <li key={b.module} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-sm text-ink">{b.module}</span>
              <Progress value={(b.correct / b.total) * 100} />
              <span className="w-12 shrink-0 text-right text-xs font-bold text-ink-muted nums">
                {Math.round((b.correct / b.total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      {priorities.length > 0 && (
        <section className="mt-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-card">
          <p className="text-sm font-bold text-ink">Prioridades antes del próximo simulacro</p>
          <ol className="mt-2 space-y-1">
            {priorities.map((p, i) => (
              <li key={p.module} className="text-sm text-ink-muted">
                <span className="font-bold text-ink">{i + 1}.</span> {p.module} ({Math.round((p.correct / p.total) * 100)}%)
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-4 text-left">
        <MentorMessage slug={closing.mentor} message={closing.message} title="Sigma" />
      </div>

      <p className="mt-4 text-xs text-ink-muted">Indicador de práctica, no es una predicción oficial del examen.</p>

      <Button asChild size="lg" className="mt-5 w-full">
        <Link href="/simulacros">Volver a Simulacros</Link>
      </Button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 shadow-card">
      {Icon ? <Icon className="mx-auto h-4 w-4 text-ink-muted" /> : <div className="h-4" />}
      <p className="mt-1.5 font-display text-lg text-ink nums">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  );
}
