"use client";

import { BookOpen, Sparkles } from "lucide-react";
import { fraccionesLesson } from "@/content/fractions";
import { MENTORS } from "@/content/mentors";
import { MentorAvatar } from "@/components/mentors/mentor-avatar";
import { Button } from "@/components/ui/button";
import { Katex } from "@/components/math/katex";
import { Badge } from "@/components/ui/badge";

export function ExplanationCard({ onContinue }: { onContinue: () => void }) {
  const { explanation } = fraccionesLesson;
  const mentor = MENTORS[explanation.mentor as keyof typeof MENTORS];
  return (
    <div>
      <Badge tone="accent" className="mb-4">
        <BookOpen className="h-3.5 w-3.5" /> Concepto
      </Badge>
      <h2 className="font-display text-xl text-ink">{explanation.title}</h2>
      <div className="mt-4 space-y-3">
        {explanation.body.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink-muted">
            {p}
          </p>
        ))}
      </div>
      {mentor && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-border bg-surface-2/50 p-3">
          <MentorAvatar slug={mentor.slug} size={36} />
          <p className="text-xs text-ink-muted">
            Te acompaña <span className="font-medium text-ink">{mentor.name}</span> — {mentor.role}
          </p>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <Button onClick={onContinue}>Entendido</Button>
      </div>
    </div>
  );
}

export function WorkedExampleCard({ onContinue }: { onContinue: () => void }) {
  const { workedExample } = fraccionesLesson;
  return (
    <div>
      <Badge tone="accent" className="mb-4">
        <Sparkles className="h-3.5 w-3.5" /> Ejemplo resuelto
      </Badge>
      <h2 className="font-display text-xl text-ink">{workedExample.title}</h2>
      <div className="mt-4 rounded-xl border border-border bg-surface-2/50 px-5 py-5 text-center">
        <Katex expr={workedExample.problemLatex} display className="text-xl" />
      </div>
      <ol className="mt-5 space-y-3">
        {workedExample.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-xs text-ink-muted">
              {i + 1}
            </span>
            <div>
              <Katex expr={s.latex} className="text-ink" />
              <p className="mt-0.5 text-sm text-ink-muted">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex justify-end">
        <Button onClick={onContinue}>A practicar</Button>
      </div>
    </div>
  );
}
