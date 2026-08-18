import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "orden-operaciones";

/* ORDER_BASIC — a + b × c ------------------------------------------------- */
export const orderBasicTemplate: ExerciseTemplate = {
  id: "ORDER_BASIC",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 12);
    const b = rng.int(2, 9);
    const c = rng.int(2, 9);
    const answer = a + b * c;
    const wrongLeftToRight = (a + b) * c;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Resolvé respetando el orden de operaciones.",
      promptLatex: `${a} + ${b} \\times ${c}`,
      promptText: `${a} + ${b} × ${c}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === wrongLeftToRight) return ["ORDER_OF_OPERATIONS"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Primero la multiplicación, después la suma. No se resuelve de izquierda a derecha.",
        `Calculá ${b} × ${c} antes de sumar ${a}.`,
        `${b} × ${c} = ${b * c}, y ${a} + ${b * c} = ${answer}.`,
      ],
      steps: [
        { latex: `${a} + ${b} \\times ${c} = ${a} + ${b * c}`, note: "Primero la multiplicación." },
        { latex: `= ${answer}`, note: "Luego la suma." },
      ],
    };
  },
};

/* ORDER_PAREN — (a + b) × c ----------------------------------------------- */
export const orderParenTemplate: ExerciseTemplate = {
  id: "ORDER_PAREN",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(2, 6);
    const answer = (a + b) * c;
    const wrong = a + b * c;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé. Los paréntesis van primero.",
      promptLatex: `(${a} + ${b}) \\times ${c}`,
      promptText: `(${a} + ${b}) × ${c}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === wrong) return ["ORDER_OF_OPERATIONS"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Lo que está entre paréntesis se resuelve primero.",
        `Calculá ${a} + ${b} y después multiplicá por ${c}.`,
        `${a} + ${b} = ${a + b}, y ${a + b} × ${c} = ${answer}.`,
      ],
      steps: [
        { latex: `(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c}`, note: "Resolvemos el paréntesis." },
        { latex: `= ${answer}`, note: "Multiplicamos." },
      ],
    };
  },
};

/* ORDER_STEP — ¿cuál es el primer paso? (opción) -------------------------- */
export const orderStepTemplate: ExerciseTemplate = {
  id: "ORDER_STEP",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(3, 12);
    const b = rng.int(2, 9);
    const c = rng.int(2, 9);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `${b} \\times ${c}`, correct: true },
      { latex: `${a} + ${b}`, correct: false },
      { latex: `${a} + ${c}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "¿Qué operación hay que resolver primero?",
      promptLatex: `${a} + ${b} \\times ${c}`,
      promptText: `${a} + ${b} × ${c}`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["ORDER_OF_OPERATIONS"],
      hints: [
        "La multiplicación tiene prioridad sobre la suma.",
        "Buscá la multiplicación en la expresión.",
        `Primero se resuelve ${b} × ${c}.`,
      ],
      steps: [
        { latex: `${b} \\times ${c} = ${b * c}`, note: "La multiplicación va antes que la suma." },
      ],
    };
  },
};

export const orderOpsTemplates: ExerciseTemplate[] = [
  orderBasicTemplate,
  orderParenTemplate,
  orderStepTemplate,
];
