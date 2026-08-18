import { validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "ecuaciones-lineales";

function signed(n: number): string {
  return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`;
}

/* SOLVE_LINEAR — ax + b = c ----------------------------------------------- */
export const solveLinearTemplate: ExerciseTemplate = {
  id: "SOLVE_LINEAR",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 9);
    const x = rng.int(1, 12);
    let b = rng.int(-9, 12);
    while (b === 0) b = rng.int(-9, 12);
    const c = a * x + b;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Despejá x.",
      promptLatex: `${a}x ${signed(b)} = ${c}`,
      promptText: `${a}x ${signed(b)} = ${c}`,
      correctAnswerDisplay: String(x),
      validate: (ans) => validateNumeric(ans, x, 0),
      classifyError: (): ErrorCategory[] => ["SIGN_ERROR"],
      hints: [
        "Pasá el término sin x al otro lado (cambiando su signo) y después dividí por el número que acompaña a la x.",
        `${a}x = ${c} ${signed(-b)}.`,
        `${a}x = ${c - b}, entonces x = ${c - b} ÷ ${a} = ${x}.`,
      ],
      steps: [
        { latex: `${a}x = ${c} ${signed(-b)}`, note: "Pasamos el término independiente." },
        { latex: `${a}x = ${c - b}`, note: "Operamos." },
        { latex: `x = \\dfrac{${c - b}}{${a}} = ${x}`, note: "Dividimos por el coeficiente." },
      ],
    };
  },
};

/* SOLVE_PAREN — a(x + b) = c ---------------------------------------------- */
export const solveParenTemplate: ExerciseTemplate = {
  id: "SOLVE_LINEAR_PAREN",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const b = rng.int(1, 8);
    const x = rng.int(1, 10);
    const c = a * (x + b);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Despejá x.",
      promptLatex: `${a}(x + ${b}) = ${c}`,
      promptText: `${a}(x + ${b}) = ${c}`,
      correctAnswerDisplay: String(x),
      validate: (ans) => validateNumeric(ans, x, 0),
      classifyError: (): ErrorCategory[] => ["DISTRIBUTIVE_PROPERTY"],
      hints: [
        "Podés dividir ambos lados por el número de afuera, o aplicar la distributiva primero.",
        `Dividí por ${a}: x + ${b} = ${c} ÷ ${a} = ${c / a}.`,
        `x = ${c / a} - ${b} = ${x}.`,
      ],
      steps: [
        { latex: `x + ${b} = \\dfrac{${c}}{${a}} = ${c / a}`, note: "Dividimos por el factor de afuera." },
        { latex: `x = ${c / a} - ${b} = ${x}`, note: "Despejamos x." },
      ],
    };
  },
};

/* SOLVE_FRACTION_EQ — x/a = b --------------------------------------------- */
export const solveFractionEqTemplate: ExerciseTemplate = {
  id: "SOLVE_FRACTION_EQ",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 8);
    const b = rng.int(2, 12);
    const answer = a * b;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Despejá x.",
      promptLatex: `\\dfrac{x}{${a}} = ${b}`,
      promptText: `x/${a} = ${b}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["ARITHMETIC_SLIP"],
      hints: [
        "Para despejar x, hacé la operación inversa a dividir: multiplicá ambos lados por el denominador.",
        `Multiplicá por ${a}: x = ${b} × ${a}.`,
        `x = ${answer}.`,
      ],
      steps: [
        { latex: `x = ${b} \\times ${a}`, note: "Multiplicamos ambos lados por el denominador." },
        { latex: `x = ${answer}`, note: "Operamos." },
      ],
    };
  },
};

export const linearEqTemplates: ExerciseTemplate[] = [
  solveLinearTemplate,
  solveParenTemplate,
  solveFractionEqTemplate,
];
