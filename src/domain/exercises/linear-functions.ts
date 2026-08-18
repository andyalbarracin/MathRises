import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "funciones-lineales";

function signed(n: number): string {
  return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`;
}

/* SLOPE_FROM_EQUATION — pendiente de y = mx + b -------------------------- */
export const slopeFromEqTemplate: ExerciseTemplate = {
  id: "SLOPE_FROM_EQUATION",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    let m = rng.int(-6, 6);
    while (m === 0) m = rng.int(-6, 6);
    let b = rng.int(-8, 8);
    while (b === 0) b = rng.int(-8, 8);
    const mTex = m === 1 ? "" : m === -1 ? "-" : `${m}`;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "¿Cuál es la pendiente de la recta?",
      promptLatex: `y = ${mTex}x ${signed(b)}`,
      promptText: `y = ${m}x ${signed(b)}`,
      correctAnswerDisplay: String(m),
      validate: (ans) => validateNumeric(ans, m, 0),
      classifyError: (): ErrorCategory[] => ["SLOPE_ERROR"],
      hints: [
        "En la forma y = mx + b, la pendiente es el número que multiplica a la x (m). El otro (b) es la ordenada al origen.",
        `Fijate qué número acompaña a la x.`,
        `La pendiente es ${m}.`,
      ],
      steps: [{ latex: `y = ${mTex}x ${signed(b)} \\;\\Rightarrow\\; m = ${m}`, note: "m es el coeficiente de x." }],
    };
  },
};

/* SLOPE_TWO_POINTS — pendiente entre dos puntos -------------------------- */
export const slopeTwoPointsTemplate: ExerciseTemplate = {
  id: "SLOPE_TWO_POINTS",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const x1 = rng.int(-4, 3);
    let x2 = rng.int(-3, 6);
    while (x2 === x1) x2 = rng.int(-3, 6);
    const m = rng.int(-4, 4);
    const y1 = rng.int(-4, 4);
    const y2 = y1 + m * (x2 - x1);
    const p = (x: number, y: number) => `(${x};\\, ${y})`;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Calculá la pendiente de la recta que pasa por estos puntos.",
      promptLatex: `A${p(x1, y1)}, \\quad B${p(x2, y2)}`,
      promptText: `A(${x1};${y1}), B(${x2};${y2})`,
      correctAnswerDisplay: String(m),
      validate: (ans) => validateNumeric(ans, m, 0),
      classifyError: (): ErrorCategory[] => ["SLOPE_ERROR"],
      hints: [
        "La pendiente es la variación de y dividida por la variación de x: m = (y₂ - y₁) / (x₂ - x₁).",
        `Δy = ${y2} - (${y1}) = ${y2 - y1}. Δx = ${x2} - (${x1}) = ${x2 - x1}.`,
        `m = ${y2 - y1} ÷ ${x2 - x1} = ${m}.`,
      ],
      steps: [
        { latex: `m = \\dfrac{${y2} - (${y1})}{${x2} - (${x1})} = \\dfrac{${y2 - y1}}{${x2 - x1}}`, note: "Variación de y sobre variación de x." },
        { latex: `= ${m}`, note: "Operamos." },
      ],
    };
  },
};

/* PARALLEL_CHECK — relación entre dos rectas ----------------------------- */
export const parallelCheckTemplate: ExerciseTemplate = {
  id: "PARALLEL_CHECK",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const kind = rng.int(0, 2); // 0 paralelas, 1 perpendiculares, 2 ninguna
    let m1: number;
    let m2: number;
    if (kind === 0) {
      m1 = rng.pick([2, 3, -2, -3, 4]);
      m2 = m1;
    } else if (kind === 1) {
      m1 = rng.pick([2, 3, -2]);
      m2 = -1 / m1; // perpendicular
    } else {
      m1 = rng.pick([2, 3, -2, 4]);
      m2 = m1 + rng.pick([1, -1, 2]);
    }
    const rel = kind === 0 ? "Paralelas" : kind === 1 ? "Perpendiculares" : "Ninguna de las dos";
    const fmtM = (m: number) => (Number.isInteger(m) ? `${m}` : `-\\frac{1}{${Math.round(-1 / m)}}`);
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: "Paralelas", correct: rel === "Paralelas" },
      { text: "Perpendiculares", correct: rel === "Perpendiculares" },
      { text: "Ninguna de las dos", correct: rel === "Ninguna de las dos" },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "¿Cómo son estas dos rectas?",
      promptLatex: `y = ${fmtM(m1)}x + 1 \\\\[4pt] y = ${fmtM(m2)}x - 2`,
      promptText: `y=${m1}x+1 ; y=${m2}x-2`,
      options,
      correctAnswerDisplay: correctText,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["PARALLEL_PERPENDICULAR"],
      hints: [
        "Son paralelas si tienen la misma pendiente. Son perpendiculares si el producto de sus pendientes es -1.",
        "Compará las pendientes (los números que multiplican a la x).",
        `En este caso: ${rel.toLowerCase()}.`,
      ],
      steps: [{ latex: `m_1 = ${fmtM(m1)}, \\quad m_2 = ${fmtM(m2)}`, note: `Corresponde: ${rel}.` }],
    };
  },
};

export const linearFunctionTemplates: ExerciseTemplate[] = [
  slopeFromEqTemplate,
  slopeTwoPointsTemplate,
  parallelCheckTemplate,
];
