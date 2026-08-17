"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CircleCheckBig, Clock, Target, RefreshCw } from "lucide-react";
import { masteryStars, MASTERY_LABEL } from "@/domain/mastery";
import type { MasteryLevel } from "@/domain/types";
import { mentorClosing } from "@/content/mentors";
import { MentorMessage } from "@/components/mentors/mentor-avatar";
import { Button } from "@/components/ui/button";

export interface SummaryData {
  xpEarned: number;
  accuracy: number; // 0–1
  durationMs: number;
  correctCount: number;
  totalCount: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  reviewInDays: number;
}

export function SessionSummary({ data }: { data: SummaryData }) {
  const xpRef = useRef<HTMLSpanElement>(null);
  const [stars, setStars] = useState(false);
  const closing = mentorClosing(data.accuracy);
  const minutes = Math.max(1, Math.round(data.durationMs / 60000));

  useEffect(() => {
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
    const t = setTimeout(() => setStars(true), 500);
    return () => {
      tween.kill();
      clearTimeout(t);
    };
  }, [data.xpEarned]);

  return (
    <div className="mx-auto w-full max-w-md text-center" data-testid="summary">
      <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">Sesión completa</p>
      <div className="mt-3 flex items-baseline justify-center gap-1">
        <span className="font-display text-5xl text-accent nums" ref={xpRef}>
          0
        </span>
        <span className="font-display text-2xl text-accent">XP</span>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <Stat icon={Target} label="Precisión" value={`${Math.round(data.accuracy * 100)}%`} />
        <Stat icon={Clock} label="Tiempo" value={`${minutes}m`} />
        <Stat
          icon={CircleCheckBig}
          label="Aciertos"
          value={`${data.correctCount}/${data.totalCount}`}
        />
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-2/50 p-4 text-left">
        <p className="text-xs text-ink-muted">Fracciones — mastery</p>
        <p
          className={`mt-1 text-lg text-warn transition-opacity duration-500 ${stars ? "opacity-100" : "opacity-0"}`}
        >
          {masteryStars(data.masteryAfter)}
          <span className="ml-2 align-middle text-sm text-ink-muted">
            {MASTERY_LABEL[data.masteryAfter]}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface-2/50 p-4 text-left text-sm text-ink-muted">
        <RefreshCw className="h-4 w-4 shrink-0 text-accent-2" />
        Próximo repaso agendado en{" "}
        <span className="font-medium text-ink">
          {data.reviewInDays === 1 ? "1 día" : `${data.reviewInDays} días`}
        </span>
        .
      </div>

      <div className="mt-4 text-left">
        <MentorMessage slug={closing.mentor} message={closing.message} />
      </div>

      <Button asChild size="lg" className="mt-8 w-full">
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
    <div className="rounded-xl border border-border bg-surface-2/50 p-3">
      <Icon className="mx-auto h-4 w-4 text-ink-muted" />
      <p className="mt-1.5 font-display text-lg text-ink nums">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  );
}
