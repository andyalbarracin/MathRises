import type { SessionMode, SessionType } from "@/domain/types";
import { TEMPLATES } from "@/domain/exercises";

export type PlanStep =
  | { kind: "explanation" }
  | { kind: "worked" }
  | { kind: "exercise"; templateId: string; isReview: boolean };

const EXERCISE_COUNT: Record<SessionMode, number> = {
  QUICK: 4,
  STANDARD: 6,
  DEEP: 9,
};

const CHOICE = new Set(["MULTIPLE_CHOICE", "ERROR_SPOTTING", "TRUE_FALSE", "MULTI_SELECT"]);
const INPUT = new Set(["NUMERIC_INPUT", "ALGEBRA_INPUT", "INTERVAL_INPUT"]);

/**
 * Arma el plan pedagógico según el tipo de sesión (puro).
 * - tranquilo: solo lectura (explicación + ejemplo), sin ejercicios.
 * - conceptos: lección + ejercicios de elegir opción.
 * - practica / resolver: lección breve + ejercicios de resolver.
 * - repaso: sin lección, mezcla de ejercicios marcados como repaso.
 */
export function buildPlan(opts: {
  templateIds: string[];
  type: SessionType;
  mode: SessionMode;
  hasDueReview: boolean;
}): PlanStep[] {
  const { templateIds, type, mode, hasDueReview } = opts;
  const templates = templateIds.map((id) => TEMPLATES[id]).filter(Boolean);
  const choicePool = templates.filter((t) => CHOICE.has(t.cardType)).map((t) => t.id);
  const inputPool = templates.filter((t) => INPUT.has(t.cardType)).map((t) => t.id);

  if (type === "tranquilo") {
    return [{ kind: "explanation" }, { kind: "worked" }];
  }

  const steps: PlanStep[] = [];

  if (hasDueReview && type !== "conceptos") {
    steps.push({ kind: "exercise", templateId: (inputPool[0] ?? templateIds[0]), isReview: true });
  }

  if (type !== "repaso") {
    steps.push({ kind: "explanation" }, { kind: "worked" });
  }

  let pool: string[];
  if (type === "conceptos") pool = choicePool.length ? choicePool : templateIds;
  else if (type === "practica" || type === "resolver") pool = inputPool.length ? inputPool : templateIds;
  else pool = templateIds;

  const n = type === "resolver" ? Math.max(3, EXERCISE_COUNT[mode] - 2) : EXERCISE_COUNT[mode];
  for (let i = 0; i < n; i++) {
    steps.push({ kind: "exercise", templateId: pool[i % pool.length], isReview: type === "repaso" });
  }

  return steps;
}
