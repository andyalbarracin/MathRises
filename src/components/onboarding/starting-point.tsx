"use client";

import { ArrowRight } from "lucide-react";
import type { AreaResult, StartingLabel } from "@/domain/diagnostic";
import { LABEL_TEXT } from "@/domain/diagnostic";
import { AREAS } from "@/content/diagnostic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MentorMessage } from "@/components/mentors/mentor-avatar";
import { Reveal } from "@/components/motion/reveal";

const TONE: Record<StartingLabel, "success" | "warn" | "danger" | "neutral"> = {
  solid: "success",
  review: "warn",
  fragile: "danger",
  unseen: "neutral",
};

function summary(results: AreaResult[]): string {
  const solid = results.filter((r) => r.label === "solid").length;
  const fragile = results.filter((r) => r.label === "fragile").length;
  if (solid >= 4) return "Tenés una base más firme de lo que pensás. Vamos a afianzar lo que falta y avanzar rápido.";
  if (fragile >= 4) return "Arrancamos desde los cimientos, sin apuro. Cada semana vas a notar el progreso.";
  return "Ya manejás varias cosas. El plan arranca por lo que está flojo y refuerza el resto con repaso espaciado.";
}

export function StartingPoint({
  results,
  onFinish,
  saving,
}: {
  results: AreaResult[];
  onFinish: () => void;
  saving: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Reveal stagger>
        <h1 className="font-display text-3xl tracking-tight text-ink">Tu punto de partida</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Esto no es una nota: es el mapa desde donde empezamos a construir.
        </p>

        <ul className="mt-6 space-y-2.5">
          {results.map((r) => {
            const info = AREAS[r.area];
            return (
              <li
                key={r.area}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <span className="text-lg" aria-hidden>
                  {info.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{info.label}</p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-accent/70"
                      style={{ width: `${Math.round(r.ratio * 100)}%` }}
                    />
                  </div>
                </div>
                <Badge tone={TONE[r.label]}>{LABEL_TEXT[r.label]}</Badge>
              </li>
            );
          })}
        </ul>

        <div className="mt-5">
          <MentorMessage slug="sigma" message={summary(results)} title="Tu plan" />
        </div>

        <Button size="lg" className="mt-6 w-full" onClick={onFinish} disabled={saving}>
          {saving ? "Preparando tu plan…" : "Ver mi plan"}
          {!saving && <ArrowRight className="h-5 w-5" />}
        </Button>
      </Reveal>
    </div>
  );
}
