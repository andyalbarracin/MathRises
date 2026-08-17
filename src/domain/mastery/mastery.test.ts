import { describe, it, expect } from "vitest";
import { initialMastery, updateMastery, meetsMasteryCriteria, type MasteryInput } from "./index";
import type { ConceptMastery } from "@/domain/types";

function attempt(over: Partial<MasteryInput> = {}): MasteryInput {
  return {
    correct: true,
    difficulty: "easy",
    hintsUsed: 0,
    responseMs: 5000,
    cardType: "NUMERIC_INPUT",
    sessionId: "s1",
    isDelayedReview: false,
    ...over,
  };
}

describe("updateMastery", () => {
  it("un solo acierto no llega a dominado", () => {
    const m = updateMastery(initialMastery("c"), attempt());
    expect(m.level).toBe(1);
    expect(m.attempts).toBe(1);
    expect(m.correct).toBe(1);
  });

  it("sube gradualmente con aciertos repetidos pero topa en 4 sin criterios", () => {
    let m = initialMastery("c");
    for (let i = 0; i < 8; i++) m = updateMastery(m, attempt());
    expect(m.level).toBe(4); // tope sin cumplir criterios de dominio
    expect(meetsMasteryCriteria(m)).toBe(false);
  });

  it("alcanza 5 solo con múltiples tipos, múltiples sesiones y repaso diferido", () => {
    let m = initialMastery("c");
    m = updateMastery(m, attempt({ cardType: "NUMERIC_INPUT", sessionId: "s1" }));
    m = updateMastery(m, attempt({ cardType: "MULTIPLE_CHOICE", sessionId: "s1" }));
    m = updateMastery(m, attempt({ cardType: "NUMERIC_INPUT", sessionId: "s2" }));
    expect(meetsMasteryCriteria(m)).toBe(false); // falta repaso diferido
    m = updateMastery(m, attempt({ sessionId: "s3", isDelayedReview: true, difficulty: "hard" }));
    expect(meetsMasteryCriteria(m)).toBe(true);
    // ahora sí puede treparse a 5
    m = updateMastery(m, attempt({ sessionId: "s4", difficulty: "hard", isDelayedReview: true }));
    expect(m.level).toBe(5);
  });

  it("un error baja el nivel pero no por debajo de 1", () => {
    let m = initialMastery("c");
    m = updateMastery(m, attempt()); // 1
    m = updateMastery(m, attempt()); // 2
    m = updateMastery(m, attempt({ correct: false })); // baja a 1
    expect(m.level).toBe(1);
    m = updateMastery(m, attempt({ correct: false, difficulty: "hard" }));
    expect(m.level).toBe(1);
  });

  it("muchas pistas atenúan la suba", () => {
    let m = initialMastery("c");
    m = updateMastery(m, attempt({ hintsUsed: 3 })); // delta 0 → introducido
    expect(m.level).toBe(1);
  });

  it("no muta el objeto previo", () => {
    const prev: ConceptMastery = initialMastery("c");
    const next = updateMastery(prev, attempt());
    expect(prev.level).toBe(0);
    expect(next).not.toBe(prev);
  });
});
