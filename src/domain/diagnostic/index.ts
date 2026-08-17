import {
  AREAS,
  AREA_ORDER,
  DIAGNOSTIC,
  type DiagnosticArea,
} from "@/content/diagnostic";
import { initialMastery } from "@/domain/mastery";
import type { ConceptMastery, MasteryLevel } from "@/domain/types";

export type StartingLabel = "solid" | "review" | "fragile" | "unseen";

export interface AreaResult {
  area: DiagnosticArea;
  correct: number;
  total: number;
  ratio: number;
  label: StartingLabel;
}

export const LABEL_TEXT: Record<StartingLabel, string> = {
  solid: "Sólido",
  review: "A repasar",
  fragile: "Frágil",
  unseen: "Sin evaluar",
};

export function labelText(label: StartingLabel): string {
  return LABEL_TEXT[label];
}

/** Nivel de mastery inicial que siembra cada etiqueta. */
export function seedLevelFor(label: StartingLabel): MasteryLevel {
  switch (label) {
    case "solid":
      return 3;
    case "review":
      return 2;
    case "fragile":
      return 1;
    case "unseen":
      return 0;
  }
}

function labelFor(correct: number, total: number): StartingLabel {
  if (total === 0) return "unseen";
  const ratio = correct / total;
  if (ratio >= 0.8) return "solid";
  if (ratio >= 0.5) return "review";
  return "fragile";
}

/**
 * Puntúa el diagnóstico por área a partir de las respuestas
 * (mapa questionId → optionId elegido). Las áreas sin responder quedan "Sin evaluar".
 */
export function scoreDiagnostic(answers: Record<string, string>): AreaResult[] {
  return AREA_ORDER.map((area) => {
    const qs = DIAGNOSTIC.filter((q) => q.area === area);
    let correct = 0;
    let total = 0;
    for (const q of qs) {
      const a = answers[q.id];
      if (a === undefined) continue;
      total += 1;
      if (a === q.correctId) correct += 1;
    }
    return { area, correct, total, ratio: total ? correct / total : 0, label: labelFor(correct, total) };
  });
}

/** Construye las masteries iniciales a sembrar según el diagnóstico. */
export function buildSeedMasteries(results: AreaResult[]): ConceptMastery[] {
  const out: ConceptMastery[] = [];
  for (const r of results) {
    const level = seedLevelFor(r.label);
    if (level === 0) continue;
    for (const conceptId of AREAS[r.area].seedConcepts) {
      out.push({ ...initialMastery(conceptId), level });
    }
  }
  return out;
}
