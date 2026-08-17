import type { ReviewResult, ReviewSchedule } from "@/domain/types";

const DAY_MS = 86_400_000;

/** Intervalos base por cantidad de aciertos consecutivos (días). */
const BASE_INTERVALS = [1, 3, 7, 14, 30];

export function initialReview(conceptId: string): ReviewSchedule {
  return {
    conceptId,
    nextReviewAt: 0,
    reviewInterval: 0,
    easeFactor: 2.5,
    reviewCount: 0,
    lastResult: null,
  };
}

function intervalFor(count: number, ease: number): number {
  if (count <= BASE_INTERVALS.length) {
    return BASE_INTERVALS[count - 1];
  }
  // Más allá de la tabla, escala por el factor de facilidad.
  return Math.round(30 * Math.pow(ease, count - BASE_INTERVALS.length));
}

/**
 * Programa el próximo repaso (SM-2 simplificado).
 * Función pura: no muta `prev`.
 */
export function schedule(
  prev: ReviewSchedule,
  result: ReviewResult,
  now: number = Date.now(),
): ReviewSchedule {
  const s: ReviewSchedule = { ...prev };

  if (result === "ok") {
    s.reviewCount += 1;
    s.reviewInterval = intervalFor(s.reviewCount, s.easeFactor);
    s.easeFactor = Math.min(2.8, s.easeFactor + 0.05);
  } else {
    s.reviewCount = 0;
    s.reviewInterval = 1;
    s.easeFactor = Math.max(1.3, s.easeFactor - 0.2);
  }

  s.lastResult = result;
  s.nextReviewAt = now + s.reviewInterval * DAY_MS;
  return s;
}

/** Conceptos con repaso vencido, ordenados por urgencia (más vencido primero). */
export function getDueReviews(
  schedules: ReviewSchedule[],
  now: number = Date.now(),
): ReviewSchedule[] {
  return schedules
    .filter((s) => s.nextReviewAt > 0 && s.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
}

/**
 * ¿Este repaso cuenta como "diferido"? Es decir, el concepto ya fue programado
 * antes (recall genuino tras una espera), no la primera exposición.
 */
export function isDelayedReview(s: ReviewSchedule): boolean {
  return s.reviewCount >= 1;
}
