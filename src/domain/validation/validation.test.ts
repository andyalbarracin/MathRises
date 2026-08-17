import { describe, it, expect } from "vitest";
import { validateFraction, validateNumeric, validateChoice } from "./index";

describe("validateFraction", () => {
  it("acepta cualquier forma equivalente cuando no exige reducir", () => {
    expect(validateFraction("2/4", { n: 1, d: 2 }).correct).toBe(true);
    expect(validateFraction("1/2", { n: 1, d: 2 }).correct).toBe(true);
  });

  it("exige mínima expresión cuando requireReduced=true", () => {
    expect(validateFraction("1/2", { n: 1, d: 2 }, true).correct).toBe(true);
    const r = validateFraction("2/4", { n: 1, d: 2 }, true);
    expect(r.correct).toBe(false);
    expect(r.detail).toContain("simplificarla");
  });

  it("rechaza valores distintos y entradas inválidas", () => {
    expect(validateFraction("3/4", { n: 1, d: 2 }).correct).toBe(false);
    expect(validateFraction("xyz", { n: 1, d: 2 }).correct).toBe(false);
  });
});

describe("validateNumeric", () => {
  it("compara con tolerancia y acepta coma decimal", () => {
    expect(validateNumeric("2", 2).correct).toBe(true);
    expect(validateNumeric("2,5", 2.5).correct).toBe(true);
    expect(validateNumeric("2.01", 2, 0.1).correct).toBe(true);
    expect(validateNumeric("3", 2, 0.1).correct).toBe(false);
  });
});

describe("validateChoice", () => {
  it("compara ids exactos", () => {
    expect(validateChoice("1", "1").correct).toBe(true);
    expect(validateChoice("0", "1").correct).toBe(false);
  });
});
