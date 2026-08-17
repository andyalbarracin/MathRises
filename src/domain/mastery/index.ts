import type {
  CardType,
  ConceptMastery,
  Difficulty,
  MasteryLevel,
} from "@/domain/types";

export interface MasteryInput {
  correct: boolean;
  difficulty: Difficulty;
  hintsUsed: number;
  responseMs: number;
  cardType: CardType;
  sessionId: string;
  isDelayedReview: boolean;
}

const SLOW_MS = 60_000;

export function initialMastery(conceptId: string): ConceptMastery {
  return {
    conceptId,
    level: 0,
    attempts: 0,
    correct: 0,
    seenTypes: [],
    sessionsSeen: [],
    lastDelayedReviewPassed: false,
    updatedAt: Date.now(),
  };
}

/** ¿Cumple los criterios para poder alcanzar el nivel 5 (dominado)? */
export function meetsMasteryCriteria(m: ConceptMastery): boolean {
  return (
    m.seenTypes.length >= 2 &&
    m.sessionsSeen.length >= 2 &&
    m.lastDelayedReviewPassed
  );
}

function clampLevel(n: number, cap: number): MasteryLevel {
  return Math.max(0, Math.min(cap, Math.round(n))) as MasteryLevel;
}

function uniquePush<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr : [...arr, v];
}

/**
 * Actualiza la mastery de un concepto a partir de un intento.
 * Función pura: no muta `prev`.
 *
 * Reglas (ver .docs/arquitectura/MASTERY_ENGINE.md):
 * - Un solo acierto nunca lleva a 5; el tope es 4 hasta cumplir criterios.
 * - Las pistas atenúan la suba; nunca bajan la mastery.
 * - Un error baja el nivel (piso 1 una vez introducido) y reabre el recall diferido.
 */
export function updateMastery(prev: ConceptMastery, input: MasteryInput): ConceptMastery {
  const m: ConceptMastery = {
    ...prev,
    seenTypes: [...prev.seenTypes],
    sessionsSeen: [...prev.sessionsSeen],
  };
  m.attempts += 1;

  const hard = input.difficulty === "hard" || input.difficulty === "challenge";

  if (input.correct) {
    m.correct += 1;
    m.seenTypes = uniquePush(m.seenTypes, input.cardType);
    m.sessionsSeen = uniquePush(m.sessionsSeen, input.sessionId);
    if (input.isDelayedReview) m.lastDelayedReviewPassed = true;

    let delta = hard ? 2 : 1;
    if (input.hintsUsed >= 3) delta -= 1; // muchas pistas: casi no sube
    if (hard && input.responseMs > SLOW_MS) delta -= 1; // lento en algo difícil
    delta = Math.max(0, delta);

    const cap = meetsMasteryCriteria(m) ? 5 : 4;
    // Un acierto deja el concepto al menos "introducido" (1).
    const raw = Math.max(1, prev.level + delta);
    m.level = clampLevel(raw, cap);
  } else {
    const drop = hard ? 2 : 1;
    m.level = Math.max(1, m.level - drop) as MasteryLevel;
    m.lastDelayedReviewPassed = false;
  }

  m.updatedAt = Date.now();
  return m;
}

/** Estrellas (0–5) para la UI. */
export function masteryStars(level: MasteryLevel): string {
  return "★".repeat(level) + "☆".repeat(5 - level);
}

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  0: "Sin ver",
  1: "Introducido",
  2: "Frágil",
  3: "En desarrollo",
  4: "Fuerte",
  5: "Dominado",
};
