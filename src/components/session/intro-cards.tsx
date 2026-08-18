"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Baby, History, ChevronDown } from "lucide-react";
import type { LessonContent } from "@/content/fractions";
import { MENTORS, type MentorSlug } from "@/content/mentors";
import { MentorAvatar } from "@/components/mentors/mentor-avatar";
import { Button } from "@/components/ui/button";
import { Katex } from "@/components/math/katex";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { highlightGlossary } from "./glossary";

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
  const { explanation, glossary } = lesson;
  const slug = explanation.mentor as MentorSlug;
  const mentor = MENTORS[slug];
  useEnterContinue(onContinue);

  // Un mismo término se resalta una sola vez a lo largo de la explicación.
  const used = new Set<string>();

  return (
    <Reveal stagger>
      <Badge tone="accent" className="mb-4">
        <BookOpen className="h-3.5 w-3.5" /> Concepto
      </Badge>
      <h2 className="font-display text-2xl text-ink">{explanation.title}</h2>
      <div className="mt-4 space-y-3">
        {explanation.body.map((p, i) => (
          <p key={i} className="text-[17px] leading-relaxed text-ink-muted">
            {highlightGlossary(p, glossary, used)}
          </p>
        ))}
      </div>

      {explanation.recall && (
        <div className="mt-5 rounded-2xl border border-c-blue/30 bg-c-blue-soft p-4">
          <div className="flex items-center gap-2 text-c-blue">
            <History className="h-4 w-4" />
            <span className="font-display text-sm font-bold">{explanation.recall.title}</span>
          </div>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{explanation.recall.text}</p>
          {explanation.recall.conceptId && (
            <Link
              href={`/sesion?concept=${explanation.recall.conceptId}&type=conceptos`}
              className="mt-2 inline-block text-sm font-bold text-c-blue hover:underline"
            >
              Verlo de nuevo →
            </Link>
          )}
        </div>
      )}

      {explanation.simple && explanation.simple.length > 0 && (
        <SimpleExplainer paragraphs={explanation.simple} />
      )}

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

/** Sección desplegable "Explicámelo fácil". */
function SimpleExplainer({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-c-green/30 bg-c-green-soft">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 p-4 text-left"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-c-green/20 text-c-green">
          <Baby className="h-4 w-4" />
        </span>
        <span className="flex-1 font-display text-[15px] font-bold text-ink">Explicámelo fácil</span>
        <ChevronDown
          className={`h-5 w-5 text-c-green transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-2.5 px-4 pb-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[16px] leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
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
  const { workedExample, glossary } = lesson;
  useEnterContinue(onContinue);
  const used = new Set<string>();
  return (
    <Reveal stagger>
      <Badge tone="accent" className="mb-4">
        <Sparkles className="h-3.5 w-3.5" /> Ejemplo resuelto
      </Badge>
      <h2 className="font-display text-2xl text-ink">{workedExample.title}</h2>
      <div className="mt-4 grid place-items-center rounded-3xl border border-border bg-surface px-5 py-6 text-center shadow-card">
        <Katex expr={workedExample.problemLatex} display className="text-2xl" />
      </div>
      <ol className="mt-5 space-y-4">
        {workedExample.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              {i + 1}
            </span>
            <div className="min-w-0">
              <Katex expr={s.latex} className="text-ink" />
              <p className="mt-1 text-[16px] leading-relaxed text-ink-muted">
                {highlightGlossary(s.note, glossary, used)}
              </p>
              {s.plain && (
                <p className="mt-1 text-[15px] leading-relaxed text-c-green">💡 {s.plain}</p>
              )}
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
