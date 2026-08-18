import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "ecuaciones-cuadraticas";

/* SOLVE_SQUARE — x^2 = k -------------------------------------------------- */
export const solveSquareTemplate: ExerciseTemplate = {
  id: "SOLVE_SQUARE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 12);
    const k = a * a;
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `x = \\pm ${a}`, correct: true },
      { latex: `x = ${a}`, correct: false },
      { latex: `x = ${k}`, correct: false },
      { latex: `x = \\dfrac{${k}}{2}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "Resolvé la ecuación.",
      promptLatex: `x^2 = ${k}`,
      promptText: `x^2 = ${k}`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["INVALID_SOLUTION"],
      hints: [
        "Al aplicar raíz cuadrada a ambos lados aparecen dos soluciones: una positiva y una negativa.",
        `√${k} = ${a}, así que x puede ser ${a} o -${a}.`,
        `x = ±${a}.`,
      ],
      steps: [
        { latex: `x = \\pm\\sqrt{${k}}`, note: "Raíz cuadrada en ambos lados (± dos soluciones)." },
        { latex: `x = \\pm ${a}`, note: "Calculamos la raíz." },
      ],
    };
  },
};

/* QUADRATIC_FACTORABLE — x^2 - (r+s)x + rs = 0 ---------------------------- */
export const quadraticFactorableTemplate: ExerciseTemplate = {
  id: "QUADRATIC_FACTORABLE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const r = rng.int(1, 6);
    const s = rng.int(1, 6);
    const sum = r + s;
    const prod = r * s;
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: `x = ${r}, x = ${s}`, correct: true },
      { text: `x = -${r}, x = -${s}`, correct: false },
      { text: `x = ${sum}, x = ${prod}`, correct: false },
      { text: `x = ${r}, x = -${s}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "Encontrá las raíces (factorizando).",
      promptLatex: `x^2 - ${sum}x + ${prod} = 0`,
      promptText: `x^2 - ${sum}x + ${prod} = 0`,
      options,
      correctAnswerDisplay: correctText,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["QUADRATIC_FORMULA"],
      hints: [
        "Buscá dos números que sumen el coeficiente del medio (con signo cambiado) y multiplicados den el término independiente.",
        `Dos números que sumen ${sum} y multipliquen ${prod}: ${r} y ${s}.`,
        `Se factoriza (x - ${r})(x - ${s}) = 0, así que x = ${r} o x = ${s}.`,
      ],
      steps: [
        { latex: `(x - ${r})(x - ${s}) = 0`, note: `Números que suman ${sum} y multiplican ${prod}.` },
        { latex: `x = ${r} \\;\\text{o}\\; x = ${s}`, note: "Cada factor igualado a cero." },
      ],
    };
  },
};

/* DISCRIMINANT — b^2 - 4ac ------------------------------------------------ */
export const discriminantTemplate: ExerciseTemplate = {
  id: "DISCRIMINANT",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(1, 3);
    const b = rng.int(2, 9);
    const c = rng.int(1, 6);
    const disc = b * b - 4 * a * c;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Calculá el discriminante (b² − 4ac).",
      promptLatex: `${a}x^2 + ${b}x + ${c}`,
      promptText: `${a}x^2 + ${b}x + ${c}`,
      correctAnswerDisplay: String(disc),
      validate: (ans) => validateNumeric(ans, disc, 0),
      classifyError: (): ErrorCategory[] => ["ORDER_OF_OPERATIONS"],
      hints: [
        "El discriminante es b² − 4·a·c. Identificá a, b y c.",
        `a = ${a}, b = ${b}, c = ${c}. Calculá ${b}² − 4·${a}·${c}.`,
        `${b * b} − ${4 * a * c} = ${disc}.`,
      ],
      steps: [
        { latex: `\\Delta = ${b}^2 - 4\\cdot ${a}\\cdot ${c}`, note: "Fórmula del discriminante." },
        { latex: `= ${b * b} - ${4 * a * c} = ${disc}`, note: "Operamos." },
      ],
    };
  },
};

export const quadraticEqTemplates: ExerciseTemplate[] = [
  solveSquareTemplate,
  quadraticFactorableTemplate,
  discriminantTemplate,
];
