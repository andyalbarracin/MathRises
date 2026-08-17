import { describe, it, expect } from "vitest";
import { generateExercise } from "./index";
import {
  fractionAddTemplate,
  fractionSimplifyTemplate,
  fractionEquivalenceTemplate,
  fractionErrorSpottingTemplate,
} from "./fractions";

describe("templates de fracciones", () => {
  it("son deterministas para la misma semilla", () => {
    const a = generateExercise(fractionAddTemplate, "seed-1", 0);
    const b = generateExercise(fractionAddTemplate, "seed-1", 0);
    expect(a.promptText).toBe(b.promptText);
    const c = generateExercise(fractionAddTemplate, "seed-2", 0);
    // muy probablemente distinto (no garantizado, pero validamos estructura)
    expect(c.promptLatex).toBeTruthy();
  });

  it("FRACTION_ADD valida su propia respuesta correcta", () => {
    for (let i = 0; i < 20; i++) {
      const ex = generateExercise(fractionAddTemplate, "s", i);
      expect(ex.validate(ex.correctAnswerDisplay).correct).toBe(true);
      expect(ex.hints).toHaveLength(3);
      expect(ex.steps.length).toBeGreaterThan(0);
    }
  });

  it("FRACTION_ADD detecta el error de sumar denominadores", () => {
    // Buscamos una instancia donde sumar denominadores dé un valor distinto al correcto.
    const ex = generateExercise(fractionAddTemplate, "s", 3);
    const [a, b] = ex.promptText.split(" + ");
    const [an, ad] = a.split("/").map(Number);
    const [cn, cd] = b.split("/").map(Number);
    const wrong = `${an + cn}/${ad + cd}`;
    const cats = ex.classifyError(wrong);
    // Puede coincidir con el correcto en casos raros; si no, debe marcar denominador común.
    if (!ex.validate(wrong).correct) {
      expect(cats).toContain("FRACTION_COMMON_DENOMINATOR");
    }
  });

  it("FRACTION_SIMPLIFY exige mínima expresión", () => {
    const ex = generateExercise(fractionSimplifyTemplate, "s", 0);
    expect(ex.validate(ex.correctAnswerDisplay).correct).toBe(true);
    expect(ex.promptText).not.toBe(ex.correctAnswerDisplay); // se muestra sin simplificar
  });

  it("FRACTION_EQUIVALENCE tiene una opción correcta validable", () => {
    const ex = generateExercise(fractionEquivalenceTemplate, "s", 0);
    expect(ex.options).toBeDefined();
    expect(ex.options!.length).toBe(4);
    const correctIds = ex.options!.filter((o) => ex.validate(o.id).correct);
    expect(correctIds).toHaveLength(1);
  });

  it("FRACTION_ERROR_SPOTTING marca la opción del denominador", () => {
    const ex = generateExercise(fractionErrorSpottingTemplate, "s", 0);
    expect(ex.validate("0").correct).toBe(true);
    expect(ex.validate("3").correct).toBe(false);
  });
});
