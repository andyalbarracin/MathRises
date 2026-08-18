import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "funciones-cuadraticas";

function term(coef: number, suffix: string): string {
  const s = coef < 0 ? "-" : "+";
  const abs = Math.abs(coef);
  return `${s} ${abs === 1 && suffix ? "" : abs}${suffix}`;
}

/* VERTEX_X — x del vértice de y = x^2 + bx + c --------------------------- */
export const vertexXTemplate: ExerciseTemplate = {
  id: "VERTEX_X",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const b = rng.pick([-6, -4, -2, 2, 4, 6]);
    let c = rng.int(-6, 6);
    while (c === 0) c = rng.int(-6, 6);
    const answer = -b / 2;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "¿Cuál es la coordenada x del vértice?",
      promptLatex: `y = x^2 ${term(b, "x")} ${term(c, "")}`,
      promptText: `y = x^2 + ${b}x + ${c}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["VERTEX_ERROR"],
      hints: [
        "La x del vértice se calcula con x = -b / (2a). Acá a = 1.",
        `Con a = 1 y b = ${b}: x = -(${b}) / 2.`,
        `x = ${answer}.`,
      ],
      steps: [
        { latex: `x_v = \\dfrac{-b}{2a} = \\dfrac{-(${b})}{2}`, note: "Fórmula del vértice (a = 1)." },
        { latex: `= ${answer}`, note: "Operamos." },
      ],
    };
  },
};

/* CONCAVITY — ¿hacia dónde abre la parábola? ----------------------------- */
export const concavityTemplate: ExerciseTemplate = {
  id: "CONCAVITY",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const b = rng.int(-4, 4);
    const aTex = a === 1 ? "" : a === -1 ? "-" : `${a}`;
    const up = a > 0;
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: "Hacia arriba", correct: up },
      { text: "Hacia abajo", correct: !up },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "¿Hacia dónde abre la parábola?",
      promptLatex: `y = ${aTex}x^2 ${term(b, "x")}`,
      promptText: `y = ${a}x^2 + ${b}x`,
      options,
      correctAnswerDisplay: correctText,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["VERTEX_ERROR"],
      hints: [
        "Mirá el signo del coeficiente que acompaña a x² (el término a).",
        "Si a es positivo abre hacia arriba; si es negativo, hacia abajo.",
        `Acá a = ${a}, así que abre ${up ? "hacia arriba" : "hacia abajo"}.`,
      ],
      steps: [{ latex: `a = ${a}`, note: up ? "Positivo: abre hacia arriba." : "Negativo: abre hacia abajo." }],
    };
  },
};

/* ROOTS_PARABOLA — raíces de la parábola --------------------------------- */
export const rootsParabolaTemplate: ExerciseTemplate = {
  id: "ROOTS_PARABOLA",
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
      instruction: "¿Dónde corta al eje x (raíces)?",
      promptLatex: `y = x^2 - ${sum}x + ${prod}`,
      promptText: `y = x^2 - ${sum}x + ${prod}`,
      options,
      correctAnswerDisplay: correctText,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["QUADRATIC_FORMULA"],
      hints: [
        "Las raíces son los valores de x donde y = 0. Factorizá el trinomio.",
        `Buscá dos números que sumen ${sum} y multipliquen ${prod}: ${r} y ${s}.`,
        `Corta en x = ${r} y x = ${s}.`,
      ],
      steps: [
        { latex: `x^2 - ${sum}x + ${prod} = (x - ${r})(x - ${s})`, note: "Factorizamos." },
        { latex: `x = ${r} \\;\\text{o}\\; x = ${s}`, note: "Raíces (y = 0)." },
      ],
    };
  },
};

export const quadraticFunctionTemplates: ExerciseTemplate[] = [
  vertexXTemplate,
  concavityTemplate,
  rootsParabolaTemplate,
];
