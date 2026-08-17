import type { SessionMode } from "@/domain/types";

export type PlanStep =
  | { kind: "explanation" }
  | { kind: "worked" }
  | { kind: "exercise"; templateId: string; isReview: boolean };

/** Cantidad de ejercicios por modo. */
const EXERCISE_COUNT: Record<SessionMode, number> = {
  QUICK: 4,
  STANDARD: 6,
  DEEP: 9,
};

/**
 * Arma el plan pedagógico de la sesión (puro).
 * Secuencia: [warm-up de repaso] → explicación → ejemplo → ejercicios → resumen.
 * El resumen no se incluye como paso: lo maneja el runner.
 */
export function buildPlan(mode: SessionMode, hasDueReview: boolean): PlanStep[] {
  const steps: PlanStep[] = [];

  if (hasDueReview) {
    steps.push({ kind: "exercise", templateId: "FRACTION_SIMPLIFY", isReview: true });
  }

  steps.push({ kind: "explanation" }, { kind: "worked" });

  // Rotación de templates con dificultad creciente.
  const rotation = [
    "FRACTION_SIMPLIFY",
    "FRACTION_ADD",
    "FRACTION_EQUIVALENCE",
    "FRACTION_ADD",
    "FRACTION_ERROR_SPOTTING",
    "FRACTION_ADD",
    "FRACTION_EQUIVALENCE",
    "FRACTION_ADD",
    "FRACTION_ERROR_SPOTTING",
  ];

  const n = EXERCISE_COUNT[mode];
  for (let i = 0; i < n; i++) {
    steps.push({ kind: "exercise", templateId: rotation[i % rotation.length], isReview: false });
  }

  return steps;
}
