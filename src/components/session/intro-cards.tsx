"use client";

import { useEffect } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import type { LessonContent } from "@/content/fractions";
import { MENTORS, type MentorSlug } from "@/content/mentors";
import { MentorAvatar } from "@/components/mentors/mentor-avatar";
import { Button } from "@/components/ui/button";
import { Katex } from "@/components/math/katex";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

/** Enter / Espacio para continuar. */
function useEnterContinue(onContinue: () => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);
}

export function ExplanationCard({
  lesson,
  onContinue,
}: {
  lesson: LessonContent;
  onContinue: () => void;
}) {
  const { explanation } = lesson;
  const slug = explanation.mentor as MentorSlug;
  const mentor = MENTORS[slug];
  useEnterContinue(onContinue);
  return (
    <Reveal stagger>
      <Badge tone="accent" className="mb-4">
        <BookOpen className="h-3.5 w-3.5" /> Concepto
      </Badge>
      <h2 className="font-display text-2xl text-ink">{explanation.title}</h2>
      <div className="mt-4 space-y-3">
        {explanation.body.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink-muted">
            {p}
          </p>
        ))}
      </div>
      {mentor && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface-2/70 p-3">
          <MentorAvatar slug={slug} size={44} />
          <p className="text-sm text-ink-muted">
            Te acompaña <span className="font-bold text-ink">{mentor.name}</span>
          </p>
        </div>
      )}
      <Button size="lg" className="mt-6 w-full" onClick={onContinue}>
        Entendido
      </Button>
    </Reveal>
  );
}

export function WorkedExampleCard({
  lesson,
  onContinue,
  lastStep,
}: {
  lesson: LessonContent;
  onContinue: () => void;
  lastStep?: boolean;
}) {
  const { workedExample } = lesson;
  useEnterContinue(onContinue);
  return (
    <Reveal stagger>
      <Badge tone="accent" className="mb-4">
        <Sparkles className="h-3.5 w-3.5" /> Ejemplo resuelto
      </Badge>
      <h2 className="font-display text-2xl text-ink">{workedExample.title}</h2>
      <div className="mt-4 grid place-items-center rounded-3xl border border-border bg-surface px-5 py-6 text-center shadow-card">
        <Katex expr={workedExample.problemLatex} display className="text-2xl" />
      </div>
      <ol className="mt-5 space-y-3">
        {workedExample.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              {i + 1}
            </span>
            <div>
              <Katex expr={s.latex} className="text-ink" />
              <p className="mt-0.5 text-sm text-ink-muted">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <Button size="lg" className="mt-6 w-full" onClick={onContinue}>
        {lastStep ? "Listo" : "A practicar"}
      </Button>
    </Reveal>
  );
}
