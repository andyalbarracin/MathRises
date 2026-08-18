import { createRng, seedFromString } from "@/lib/rng";
import { fractionTemplates } from "./fractions";
import { integerTemplates } from "./integers";
import { orderOpsTemplates } from "./order-ops";
import { powerTemplates } from "./powers";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

export * from "./types";
export { fractionTemplates } from "./fractions";

const ALL_TEMPLATES = [
  ...fractionTemplates,
  ...integerTemplates,
  ...orderOpsTemplates,
  ...powerTemplates,
];

/** Todos los templates registrados, indexados por id. */
export const TEMPLATES: Record<string, ExerciseTemplate> = Object.fromEntries(
  ALL_TEMPLATES.map((t) => [t.id, t]),
);

export function templatesForConcept(conceptId: string): ExerciseTemplate[] {
  return Object.values(TEMPLATES).filter((t) => t.conceptId === conceptId);
}

/**
 * Genera una instancia a partir de un template y una semilla (string).
 * Misma semilla ⇒ mismo ejercicio (reproducible).
 */
export function generateExercise(
  template: ExerciseTemplate,
  seed: string,
  index = 0,
): GeneratedExercise {
  const rng = createRng(seedFromString(`${template.id}:${seed}:${index}`));
  return template.generate(rng, index);
}
