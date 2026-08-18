import { describe, it, expect } from "vitest";
import { TEMPLATES, generateExercise } from "./index";

const INPUT_TYPES = new Set(["NUMERIC_INPUT", "ALGEBRA_INPUT", "INTERVAL_INPUT"]);
const CHOICE_TYPES = new Set(["MULTIPLE_CHOICE", "ERROR_SPOTTING"]);

describe("consistencia de todos los templates", () => {
  const templates = Object.values(TEMPLATES);

  it("hay templates registrados", () => {
    expect(templates.length).toBeGreaterThan(20);
  });

  for (const template of templates) {
    it(`${template.id} genera ejercicios consistentes`, () => {
      for (let i = 0; i < 25; i++) {
        const ex = generateExercise(template, `seed-${i}`, i);

        // Estructura básica
        expect(ex.hints).toHaveLength(3);
        expect(ex.steps.length).toBeGreaterThan(0);
        expect(ex.promptLatex.length).toBeGreaterThan(0);
        expect(ex.instruction.length).toBeGreaterThan(0);

        if (INPUT_TYPES.has(ex.cardType)) {
          // La respuesta correcta declarada valida como correcta.
          expect(ex.validate(ex.correctAnswerDisplay).correct).toBe(true);
        } else if (CHOICE_TYPES.has(ex.cardType)) {
          expect(ex.options).toBeDefined();
          const correct = ex.options!.filter((o) => ex.validate(o.id).correct);
          expect(correct).toHaveLength(1);
        }
      }
    });
  }
});
