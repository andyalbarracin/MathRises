"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CircleCheckBig, Clock, Target } from "lucide-react";
import { masteryStars, MASTERY_LABEL } from "@/domain/mastery";
import type { MasteryLevel, SessionType } from "@/domain/types";
import { mentorClosing } from "@/content/mentors";
import { MentorMessage } from "@/components/mentors/mentor-avatar";
import { Mascot } from "@/components/art/mascot";
import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/sound";

export interface SummaryData {
  sessionType: SessionType;
  xpEarned: number;
  accuracy: number;
  durationMs: number;
  correctCount: number;
  totalCount: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  reviewInDays: number;
}

export function SessionSummary({ data }: { data: SummaryData }) {
  const xpRef = useRef<HTMLSpanElement>(null);
  const closing = mentorClosing(data.accuracy);
  const minutes = Math.max(1, Math.round(data.durationMs / 60000));
  const passive = data.totalCount === 0;

  useEffect(() => {
    playSound("complete");
    const el = xpRef.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: data.xpEarned,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
    });
    return () => {
      tween.kill();
    };
  }, [data.xpEarned]);

  return (
    <div className="mx-auto w-full max-w-md text-center" data-testid="summary">
      <div className="mx-auto -mb-2 w-fit">
        <Mascot tone="violet" expression="cheer" symbol="★" size={120} />
      </div>
      <p className="font-display text-2xl text-ink">{passive ? "¡Buen repaso!" : "¡Sesión completa!"}</p>

      <div className="mt-3 inline-flex items-baseline gap-1 rounded-full bg-accent-soft px-5 py-2">
        <span className="font-display text-4xl text-accent nums" ref={xpRef}>
          0
        </span>
        <span className="font-display text-xl text-accent">XP</span>
      </div>

      {!passive && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat icon={Target} label="Precisión" value={`${Math.round(data.accuracy * 100)}%`} />
          <Stat icon={Clock} label="Tiempo" value={`${minutes}m`} />
          <Stat icon={CircleCheckBig} label="Aciertos" value={`${data.correctCount}/${data.totalCount}`} />
        </div>
      )}

      {!passive && (
        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-card">
          <p className="text-xs font-semibold text-ink-muted">Tu dominio del tema</p>
          <p className="mt-1 text-lg text-c-amber">
            {masteryStars(data.masteryAfter)}
            <span className="ml-2 align-middle text-sm text-ink-muted">
              {MASTERY_LABEL[data.masteryAfter]}
            </span>
          </p>
        </div>
      )}

      <div className="mt-4 text-left">
        <MentorMessage slug={closing.mentor} message={closing.message} title="Sigma" />
      </div>

      <Button asChild size="lg" className="mt-6 w-full">
        <Link href="/">Volver a Hoy</Link>
      </Button>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 shadow-card">
      <Icon className="mx-auto h-4 w-4 text-ink-muted" />
      <p className="mt-1.5 font-display text-lg text-ink nums">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  );
}
