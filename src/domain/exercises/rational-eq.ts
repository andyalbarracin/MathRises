import { validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "ecuaciones-racionales";

/* RATIONAL_EQ_SOLVE — k/x = m -------------------------------------------- */
export const rationalEqSolveTemplate: ExerciseTemplate = {
  id: "RATIONAL_EQ_SOLVE",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const x = rng.int(2, 9);
    const m = rng.int(2, 8);
    const k = x * m;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé la ecuación (despejá x).",
      promptLatex: `\\dfrac{${k}}{x} = ${m}`,
      promptText: `${k}/x = ${m}`,
      correctAnswerDisplay: String(x),
      validate: (ans) => validateNumeric(ans, x, 0),
      classifyError: (): ErrorCategory[] => ["INVALID_SOLUTION"],
      hints: [
        "Multiplicá ambos lados por x para sacar la x del denominador, y después despejá.",
        `${k} = ${m}·x, entonces x = ${k} ÷ ${m}.`,
        `x = ${x}.`,
      ],
      steps: [
        { latex: `${k} = ${m}\\,x`, note: "Multiplicamos ambos lados por x." },
        { latex: `x = \\dfrac{${k}}{${m}} = ${x}`, note: "Despejamos x." },
      ],
    };
  },
};

/* CROSS_MULTIPLY — x/a = b/c --------------------------------------------- */
export const crossMultiplyTemplate: ExerciseTemplate = {
  id: "CROSS_MULTIPLY",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const c = rng.int(2, 5);
    const mm = rng.int(2, 6);
    const b = c * mm;
    const x = a * mm; // x/a = mm = b/c
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé la proporción (despejá x).",
      promptLatex: `\\dfrac{x}{${a}} = \\dfrac{${b}}{${c}}`,
      promptText: `x/${a} = ${b}/${c}`,
      correctAnswerDisplay: String(x),
      validate: (ans) => validateNumeric(ans, x, 0),
      classifyError: (): ErrorCategory[] => ["INVALID_SOLUTION"],
      hints: [
        "Multiplicá en cruz: x · c = a · b, y después despejá x.",
        `x = ${a}·${b} ÷ ${c}.`,
        `x = ${x}.`,
      ],
      steps: [
        { latex: `x \\cdot ${c} = ${a} \\cdot ${b}`, note: "Multiplicamos en cruz." },
        { latex: `x = \\dfrac{${a * b}}{${c}} = ${x}`, note: "Despejamos x." },
      ],
    };
  },
};

/* EXCLUDED_VALUE — raíz prohibida ---------------------------------------- */
export const excludedValueTemplate: ExerciseTemplate = {
  id: "EXCLUDED_VALUE",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(1, 9);
    const k = rng.int(2, 9);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "¿Qué valor de x NO puede ser solución (raíz prohibida)?",
      promptLatex: `\\dfrac{${k}}{x - ${a}} = 2`,
      promptText: `${k}/(x-${a}) = 2`,
      correctAnswerDisplay: String(a),
      validate: (ans) => validateNumeric(ans, a, 0),
      classifyError: (): ErrorCategory[] => ["DOMAIN_RESTRICTION"],
      hints: [
        "El denominador no puede ser cero: ese valor queda prohibido, aunque saliera al resolver.",
        `x - ${a} = 0 cuando x = ${a}.`,
        `El valor prohibido es x = ${a}.`,
      ],
      steps: [
        { latex: `x - ${a} \\neq 0 \\;\\Rightarrow\\; x \\neq ${a}`, note: "El denominador no puede anularse." },
      ],
    };
  },
};

export const rationalEqTemplates: ExerciseTemplate[] = [
  rationalEqSolveTemplate,
  crossMultiplyTemplate,
  excludedValueTemplate,
];
