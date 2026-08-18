"use client";

import { Fragment, useState, type ReactNode } from "react";
import type { GlossaryEntry } from "@/content/fractions";

/**
 * Término del glosario: aparece subrayado dentro del texto y, al tocarlo,
 * muestra una explicación simple ("como si tuvieras 10 años").
 */
export function GlossaryTerm({ term, plain }: { term: string; plain: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="cursor-help font-semibold text-accent underline decoration-dotted decoration-2 underline-offset-2"
      >
        {term}
      </button>
      {open && (
        <>
          {/* Capa para cerrar al tocar afuera. */}
          <span
            className="fixed inset-0 z-20"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <span
            role="tooltip"
            className="absolute left-0 top-full z-30 mt-1.5 block w-[min(17rem,78vw)] rounded-2xl border border-border bg-surface-2 p-3 text-left text-[15px] font-normal leading-snug text-ink shadow-pop"
          >
            <span className="mb-0.5 block font-display text-sm font-bold text-accent">{term}</span>
            {plain}
          </span>
        </>
      )}
    </span>
  );
}

/**
 * Resalta en `text` la primera aparición de cada término del glosario (sin
 * repetir un término ya usado en `used`), envolviéndolo en <GlossaryTerm>.
 */
export function highlightGlossary(
  text: string,
  glossary: GlossaryEntry[] | undefined,
  used: Set<string>,
): ReactNode {
  if (!glossary || glossary.length === 0) return text;

  const lower = text.toLowerCase();
  const ranges: { start: number; end: number; entry: GlossaryEntry }[] = [];
  for (const entry of glossary) {
    if (used.has(entry.term)) continue;
    const idx = lower.indexOf(entry.term.toLowerCase());
    if (idx >= 0) ranges.push({ start: idx, end: idx + entry.term.length, entry });
  }
  if (ranges.length === 0) return text;

  // Elegimos apariciones sin solaparse, de izquierda a derecha;
  // a igual inicio, preferimos el término más largo ("denominador común").
  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  const chosen: typeof ranges = [];
  let lastEnd = -1;
  for (const r of ranges) {
    if (r.start >= lastEnd) {
      chosen.push(r);
      lastEnd = r.end;
      used.add(r.entry.term);
    }
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;
  chosen.forEach((r, i) => {
    if (r.start > cursor) nodes.push(<Fragment key={`t${i}`}>{text.slice(cursor, r.start)}</Fragment>);
    nodes.push(
      <GlossaryTerm key={`g${i}`} term={text.slice(r.start, r.end)} plain={r.entry.plain} />,
    );
    cursor = r.end;
  });
  if (cursor < text.length) nodes.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>);
  return nodes;
}
