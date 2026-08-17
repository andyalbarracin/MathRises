import { describe, it, expect } from "vitest";
import { initialReview, schedule, getDueReviews, isDelayedReview } from "./index";

const DAY = 86_400_000;
const NOW = Date.parse("2026-08-17T10:00:00Z");

describe("schedule (SM-2 simplificado)", () => {
  it("progresa 1 → 3 → 7 → 14 → 30 días con aciertos", () => {
    let s = initialReview("c");
    const seen: number[] = [];
    for (let i = 0; i < 5; i++) {
      s = schedule(s, "ok", NOW);
      seen.push(s.reviewInterval);
    }
    expect(seen).toEqual([1, 3, 7, 14, 30]);
    expect(s.nextReviewAt).toBe(NOW + 30 * DAY);
  });

  it("un error resetea el intervalo a 1 día y baja el ease", () => {
    let s = initialReview("c");
    s = schedule(s, "ok", NOW);
    s = schedule(s, "ok", NOW);
    const beforeEase = s.easeFactor;
    s = schedule(s, "fail", NOW);
    expect(s.reviewInterval).toBe(1);
    expect(s.reviewCount).toBe(0);
    expect(s.easeFactor).toBeLessThan(beforeEase);
  });
});

describe("getDueReviews", () => {
  it("devuelve solo los vencidos, ordenados por urgencia", () => {
    const a = { ...initialReview("a"), nextReviewAt: NOW - 2 * DAY };
    const b = { ...initialReview("b"), nextReviewAt: NOW - 1 * DAY };
    const c = { ...initialReview("c"), nextReviewAt: NOW + 1 * DAY };
    const due = getDueReviews([c, b, a], NOW);
    expect(due.map((s) => s.conceptId)).toEqual(["a", "b"]);
  });

  it("ignora los que nunca fueron programados (nextReviewAt=0)", () => {
    expect(getDueReviews([initialReview("x")], NOW)).toHaveLength(0);
  });
});

describe("isDelayedReview", () => {
  it("es diferido cuando ya fue programado antes", () => {
    let s = initialReview("c");
    expect(isDelayedReview(s)).toBe(false);
    s = schedule(s, "ok", NOW);
    expect(isDelayedReview(s)).toBe(true);
  });
});
