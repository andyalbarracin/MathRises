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
import { Mascot } from "@/components/art/mascot";
import { highlightGlossary } from "./glossary";

/** Une una lista en prosa: ["a","b","c"] → "a, b y c". */
function formatList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

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
  const { explanation, glossary, materials } = lesson;
  const slug = explanation.mentor as MentorSlug;
  const mentor = MENTORS[slug];
  useEnterContinue(onContinue);

  // Un mismo término se resalta una sola vez a lo largo de la explicación.
  const used = new Set<string>();

  return (
    <Reveal stagger>
      {materials && materials.length > 0 && (
        <div className="mb-5 flex items-center gap-2.5">
          <Mascot expression="wink" size={56} className="shrink-0" />
          <div className="relative rounded-2xl rounded-bl-md border border-c-amber/30 bg-c-amber-soft px-4 py-3">
            <p className="text-[15px] leading-relaxed text-ink">
              Para esta lección tené a mano{" "}
              <span className="font-bold">{formatList(materials)}</span>. 😉
            </p>
          </div>
        </div>
      )}
      <Badge tone="accent" className="mb-4">
        <BookOpen className="h-3.5 w-3.5" /> Concepto
      </Badge>
      <h2 className="font-display text-2xl text-ink">{explanation.title}</h2>
      <div className="mt-5 space-y-3.5">
        {explanation.body.map((p, i) => (
          <p key={i} className="text-[17px] leading-relaxed text-ink-muted">
            {highlightGlossary(p, glossary, used)}
          </p>
        ))}
      </div>

      {explanation.recall && (
        <div className="mt-6 rounded-2xl border border-c-blue/25 bg-c-blue-soft p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-c-blue/15 text-c-blue">
              <History className="h-[18px] w-[18px]" />
            </span>
            <span className="font-display text-[15px] font-bold text-ink">{explanation.recall.title}</span>
          </div>
          <p className="mt-3 text-[16px] leading-relaxed text-ink">{explanation.recall.text}</p>
          {explanation.recall.conceptId && (
            <Link
              href={`/sesion?concept=${explanation.recall.conceptId}&type=conceptos`}
              className="mt-3 inline-block text-sm font-bold text-c-blue hover:underline"
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
    <div className="mt-4 overflow-hidden rounded-2xl border border-c-green/25 bg-c-green-soft">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-c-green/15 text-c-green">
          <Baby className="h-[18px] w-[18px]" />
        </span>
        <span className="flex-1 font-display text-[15px] font-bold text-ink">Explicámelo fácil</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-c-green transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-c-green/20 px-5 pb-5 pt-4">
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
            <div className="min-w-0 flex-1">
              <Katex expr={s.latex} className="text-ink" />
              <p className="mt-1.5 text-[16px] leading-relaxed text-ink-muted">
                {highlightGlossary(s.note, glossary, used)}
              </p>
              {s.plain && (
                <p className="mt-2.5 rounded-xl bg-c-green-soft px-3.5 py-2.5 text-[15px] leading-relaxed text-c-green">
                  {s.plain}
                </p>
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
