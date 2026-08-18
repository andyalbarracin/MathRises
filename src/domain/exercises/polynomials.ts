import { validateChoice } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "polinomios";

function termX(c: number): string {
  if (c === 1) return "x";
  if (c === -1) return "-x";
  return `${c}x`;
}
function lin(p: number, q: number): string {
  const px = termX(p);
  if (q === 0) return px;
  return `${px} ${q < 0 ? "-" : "+"} ${Math.abs(q)}`;
}

/* POLY_ADD — suma de binomios --------------------------------------------- */
export const polyAddTemplate: ExerciseTemplate = {
  id: "POLY_ADD",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const c = rng.int(1, 6);
    const b = rng.int(1, 8);
    const d = rng.int(1, 8);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: lin(a + c, b + d), correct: true },
      { latex: lin(a * c, b + d), correct: false },
      { latex: lin(a + c, b), correct: false },
      { latex: lin(a + c, b * d), correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Sumá los dos binomios.",
      promptLatex: `(${lin(a, b)}) + (${lin(c, d)})`,
      promptText: `(${lin(a, b)}) + (${lin(c, d)})`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["DISTRIBUTIVE_PROPERTY"],
      hints: [
        "Sumá por separado los términos con x y los términos sin x (los semejantes).",
        `Términos con x: ${a}x + ${c}x. Términos sin x: ${b} + ${d}.`,
        `Queda ${lin(a + c, b + d)}.`,
      ],
      steps: [
        { latex: `(${a}+${c})x + (${b}+${d})`, note: "Agrupamos términos semejantes." },
        { latex: `= ${lin(a + c, b + d)}`, note: "Operamos." },
      ],
    };
  },
};

/* MONO_MULT — producto de monomios ---------------------------------------- */
export const monoMultTemplate: ExerciseTemplate = {
  id: "MONO_MULT",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 7);
    const b = rng.int(2, 7);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `${a * b}x^2`, correct: true },
      { latex: `${a + b}x^2`, correct: false },
      { latex: `${a * b}x`, correct: false },
      { latex: `${a + b}x`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Multiplicá los monomios.",
      promptLatex: `${a}x \\cdot ${b}x`,
      promptText: `${a}x · ${b}x`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["EXPONENT_RULE"],
      hints: [
        "Multiplicá los coeficientes y sumá los exponentes de x (x·x = x²).",
        `Coeficientes: ${a}·${b}. Exponentes: x·x = x².`,
        `Queda ${a * b}x².`,
      ],
      steps: [
        { latex: `${a}x \\cdot ${b}x = (${a}\\cdot${b})(x\\cdot x)`, note: "Separamos coeficientes y letras." },
        { latex: `= ${a * b}x^2`, note: "x·x = x²." },
      ],
    };
  },
};

/* NOTABLE_SQUARE — (x + a)^2 ---------------------------------------------- */
export const notableSquareTemplate: ExerciseTemplate = {
  id: "NOTABLE_SQUARE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(1, 7);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `x^2 + ${2 * a}x + ${a * a}`, correct: true },
      { latex: `x^2 + ${a * a}`, correct: false },
      { latex: `x^2 + ${a}x + ${a * a}`, correct: false },
      { latex: `x^2 + ${2 * a}x + ${2 * a}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "Desarrollá el cuadrado del binomio.",
      promptLatex: `(x + ${a})^2`,
      promptText: `(x + ${a})^2`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FACTORING_PATTERN"],
      hints: [
        "Cuadrado de un binomio: (x + a)² = x² + 2·a·x + a². No es solo x² + a².",
        `Acá a = ${a}: el término del medio es 2·${a}·x = ${2 * a}x.`,
        `Queda x² + ${2 * a}x + ${a * a}.`,
      ],
      steps: [
        { latex: `(x + ${a})^2 = x^2 + 2\\cdot ${a}\\cdot x + ${a}^2`, note: "Cuadrado del primero, doble producto, cuadrado del segundo." },
        { latex: `= x^2 + ${2 * a}x + ${a * a}`, note: "Operamos." },
      ],
    };
  },
};

export const polynomialTemplates: ExerciseTemplate[] = [
  polyAddTemplate,
  monoMultTemplate,
  notableSquareTemplate,
];
