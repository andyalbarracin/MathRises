import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "concepto-funcion";

function signed(n: number): string {
  return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`;
}

/* FUNCTION_EVAL — f(x) = ax + b, calcular f(v) ---------------------------- */
export const functionEvalTemplate: ExerciseTemplate = {
  id: "FUNCTION_EVAL",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    let b = rng.int(-6, 9);
    while (b === 0) b = rng.int(-6, 9);
    const v = rng.int(2, 8);
    const answer = a * v + b;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: `Si f(x) = ${a}x ${signed(b)}, calculá f(${v}).`,
      promptLatex: `f(${v})`,
      promptText: `f(${v}) con f(x)=${a}x ${signed(b)}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["FUNCTION_DOMAIN"],
      hints: [
        "Evaluar una función es reemplazar la x por el número indicado y calcular.",
        `Reemplazá: ${a}·${v} ${signed(b)}.`,
        `${a}·${v} = ${a * v}, y ${a * v} ${signed(b)} = ${answer}.`,
      ],
      steps: [
        { latex: `f(${v}) = ${a}\\cdot ${v} ${signed(b)}`, note: "Reemplazamos x por el valor." },
        { latex: `= ${answer}`, note: "Operamos." },
      ],
    };
  },
};

/* FUNCTION_EVAL_SQUARE — f(x) = x^2 + b, calcular f(v) -------------------- */
export const functionEvalSquareTemplate: ExerciseTemplate = {
  id: "FUNCTION_EVAL_SQUARE",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const b = rng.int(1, 6);
    const v = rng.int(-4, 5);
    const answer = v * v + b;
    const vTex = v < 0 ? `(${v})` : `${v}`;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: `Si f(x) = x² + ${b}, calculá f(${v}).`,
      promptLatex: `f(${v})`,
      promptText: `f(${v}) con f(x)=x^2+${b}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["SIGN_ERROR"],
      hints: [
        "Reemplazá x por el valor y recordá que un número negativo al cuadrado da positivo.",
        `${vTex}² + ${b}.`,
        `${vTex}² = ${v * v}, y ${v * v} + ${b} = ${answer}.`,
      ],
      steps: [
        { latex: `f(${v}) = ${vTex}^2 + ${b}`, note: "Reemplazamos x." },
        { latex: `= ${v * v} + ${b} = ${answer}`, note: "El cuadrado siempre es positivo." },
      ],
    };
  },
};

/* DOMAIN_MC — elegir el dominio ------------------------------------------- */
export const domainMcTemplate: ExerciseTemplate = {
  id: "DOMAIN_MC",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(1, 8);
    const rational = rng.pick([true, false]);
    if (rational) {
      const { options, correctId, correctLatex } = buildChoices(rng, [
        { latex: `\\mathbb{R} - \\{${a}\\}`, correct: true },
        { latex: `\\mathbb{R}`, correct: false },
        { latex: `x > ${a}`, correct: false },
        { latex: `x \\geq ${a}`, correct: false },
      ]);
      return {
        id: `${this.id}-${index}`,
        conceptId: CONCEPT_ID,
        templateId: this.id,
        cardType: "MULTIPLE_CHOICE",
        difficulty: "hard",
        instruction: "¿Cuál es el dominio de la función?",
        promptLatex: `f(x) = \\dfrac{1}{x - ${a}}`,
        promptText: `f(x)=1/(x-${a})`,
        options,
        correctAnswerDisplay: correctLatex,
        validate: (ans) => validateChoice(ans, correctId),
        classifyError: (): ErrorCategory[] => ["FUNCTION_DOMAIN"],
        hints: [
          "En una fracción, el denominador nunca puede ser cero. Buscá qué valor de x lo anula.",
          `x - ${a} = 0 cuando x = ${a}: ese valor queda excluido.`,
          `El dominio es todos los reales menos ${a}.`,
        ],
        steps: [
          { latex: `x - ${a} \\neq 0 \\;\\Rightarrow\\; x \\neq ${a}`, note: "El denominador no puede ser cero." },
          { latex: `\\text{Dom} = \\mathbb{R} - \\{${a}\\}`, note: "Excluimos ese valor." },
        ],
      };
    }
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `x \\geq ${a}`, correct: true },
      { latex: `x > ${a}`, correct: false },
      { latex: `\\mathbb{R}`, correct: false },
      { latex: `x \\leq ${a}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "¿Cuál es el dominio de la función?",
      promptLatex: `f(x) = \\sqrt{x - ${a}}`,
      promptText: `f(x)=√(x-${a})`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FUNCTION_DOMAIN"],
      hints: [
        "Dentro de una raíz cuadrada, lo de adentro no puede ser negativo (debe ser ≥ 0).",
        `x - ${a} \\geq 0 cuando x ≥ ${a}.`,
        `El dominio es x ≥ ${a}.`,
      ],
      steps: [
        { latex: `x - ${a} \\geq 0 \\;\\Rightarrow\\; x \\geq ${a}`, note: "El radicando debe ser no negativo." },
      ],
    };
  },
};

export const functionTemplates: ExerciseTemplate[] = [
  functionEvalTemplate,
  functionEvalSquareTemplate,
  domainMcTemplate,
];
