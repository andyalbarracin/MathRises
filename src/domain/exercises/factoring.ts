import { validateChoice } from "@/domain/validation";
import { gcd } from "@/domain/math/fraction";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "factorizacion-1";

function linInner(p: number, q: number): string {
  const px = p === 1 ? "x" : `${p}x`;
  return `${px} + ${q}`;
}

/* COMMON_FACTOR — sacar factor común -------------------------------------- */
export const commonFactorTemplate: ExerciseTemplate = {
  id: "COMMON_FACTOR",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const g = rng.int(2, 6);
    const p = rng.int(2, 5);
    let q = rng.int(1, 8);
    while (gcd(p, q) !== 1) q = rng.int(1, 8);
    const A = g * p;
    const B = g * q;
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `${g}(${linInner(p, q)})`, correct: true },
      { latex: `${g}(${linInner(p, g * q)})`, correct: false },
      { latex: `${A}(x + ${q})`, correct: false },
      { latex: `${g}x(${p} + ${q})`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Sacá el factor común.",
      promptLatex: `${A}x + ${B}`,
      promptText: `${A}x + ${B}`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FACTOR_COMMON"],
      hints: [
        "Buscá el mayor número que divide a ambos coeficientes y sacalo de factor común.",
        `El factor común de ${A} y ${B} es ${g}. Dividí cada término por ${g}.`,
        `${A}x ÷ ${g} = ${p}x y ${B} ÷ ${g} = ${q}.`,
      ],
      steps: [
        { latex: `${A}x + ${B} = ${g}\\cdot ${p}x + ${g}\\cdot ${q}`, note: `Factor común: ${g}.` },
        { latex: `= ${g}(${linInner(p, q)})`, note: "Sacamos el factor común." },
      ],
    };
  },
};

/* DIFF_SQUARES — diferencia de cuadrados ---------------------------------- */
export const diffSquaresTemplate: ExerciseTemplate = {
  id: "DIFF_SQUARES",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 9);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `(x + ${a})(x - ${a})`, correct: true },
      { latex: `(x - ${a})(x - ${a})`, correct: false },
      { latex: `(x + ${a})^2`, correct: false },
      { latex: `(x + ${a * a})(x - ${a * a})`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "Factorizá la diferencia de cuadrados.",
      promptLatex: `x^2 - ${a * a}`,
      promptText: `x^2 - ${a * a}`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FACTORING_PATTERN"],
      hints: [
        "a² - b² = (a + b)(a - b). Acá b² es el número, así que b es su raíz.",
        `√${a * a} = ${a}, entonces b = ${a}.`,
        `Queda (x + ${a})(x - ${a}).`,
      ],
      steps: [
        { latex: `x^2 - ${a * a} = x^2 - ${a}^2`, note: "Reconocemos la diferencia de cuadrados." },
        { latex: `= (x + ${a})(x - ${a})`, note: "Aplicamos la fórmula." },
      ],
    };
  },
};

/* FACTOR_METHOD — reconocer el método ------------------------------------- */
export const factorMethodTemplate: ExerciseTemplate = {
  id: "FACTOR_METHOD",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const M_COMMON = "Factor común";
    const M_DIFF = "Diferencia de cuadrados";
    const M_TRIN = "Trinomio cuadrado perfecto";
    const kind = rng.int(0, 2);
    let latex: string;
    let method: string;
    if (kind === 0) {
      const g = rng.int(2, 6);
      latex = `${g * 2}x + ${g * 3}`;
      method = M_COMMON;
    } else if (kind === 1) {
      const a = rng.int(2, 9);
      latex = `x^2 - ${a * a}`;
      method = M_DIFF;
    } else {
      const a = rng.int(2, 7);
      latex = `x^2 + ${2 * a}x + ${a * a}`;
      method = M_TRIN;
    }
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: M_COMMON, correct: method === M_COMMON },
      { text: M_DIFF, correct: method === M_DIFF },
      { text: M_TRIN, correct: method === M_TRIN },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "¿Qué método de factorización conviene?",
      promptLatex: latex,
      promptText: latex,
      options,
      correctAnswerDisplay: correctText,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FACTORING_PATTERN"],
      hints: [
        "Fijate en la forma: ¿hay factor común en todos los términos? ¿es una resta de dos cuadrados? ¿es un trinomio a² + 2ab + b²?",
        "Contá los términos y mirá los signos.",
        `Acá conviene: ${method}.`,
      ],
      steps: [{ latex, note: `Corresponde: ${method}.` }],
    };
  },
};

export const factoringTemplates: ExerciseTemplate[] = [
  commonFactorTemplate,
  diffSquaresTemplate,
  factorMethodTemplate,
];
