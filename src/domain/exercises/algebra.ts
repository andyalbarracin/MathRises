import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "expresiones-algebraicas";

/** Formatea un término c·x (1x → x, -1x → -x). */
function term(c: number): string {
  if (c === 1) return "x";
  if (c === -1) return "-x";
  return `${c}x`;
}

/* COMBINE_LIKE — reducir términos semejantes ------------------------------ */
export const combineLikeTemplate: ExerciseTemplate = {
  id: "COMBINE_LIKE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 7);
    const b = rng.int(1, 5);
    const coef = a + b - 1;
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: term(coef), correct: true },
      { latex: term(a + b + 1), correct: false },
      { latex: `${coef}x^2`, correct: false },
      { latex: term(a), correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "Reducí los términos semejantes.",
      promptLatex: `${a}x + ${b}x - x`,
      promptText: `${a}x + ${b}x - x`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["DISTRIBUTIVE_PROPERTY"],
      hints: [
        "Los términos semejantes tienen la misma parte con letra: se suman/restan sus coeficientes.",
        `Sumá los coeficientes: ${a} + ${b} - 1.`,
        `${a} + ${b} - 1 = ${coef}, entonces queda ${term(coef)}.`,
      ],
      steps: [
        { latex: `${a}x + ${b}x - x = (${a} + ${b} - 1)x`, note: "Sumamos coeficientes." },
        { latex: `= ${term(coef)}`, note: "Resultado." },
      ],
    };
  },
};

/* DISTRIBUTE — propiedad distributiva ------------------------------------- */
export const distributeTemplate: ExerciseTemplate = {
  id: "DISTRIBUTE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const b = rng.int(2, 8);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `${a}x + ${a * b}`, correct: true },
      { latex: `${a}x + ${b}`, correct: false },
      { latex: `x + ${a * b}`, correct: false },
      { latex: `${a}x + ${a + b}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "Aplicá la propiedad distributiva.",
      promptLatex: `${a}(x + ${b})`,
      promptText: `${a}(x + ${b})`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["DISTRIBUTIVE_PROPERTY"],
      hints: [
        "El número de afuera multiplica a cada término de adentro del paréntesis.",
        `Multiplicá ${a} por x y ${a} por ${b}.`,
        `${a}·x = ${a}x y ${a}·${b} = ${a * b}.`,
      ],
      steps: [
        { latex: `${a}(x + ${b}) = ${a}\\cdot x + ${a}\\cdot ${b}`, note: "Distribuimos." },
        { latex: `= ${a}x + ${a * b}`, note: "Operamos." },
      ],
    };
  },
};

/* EVALUATE — evaluar una expresión ---------------------------------------- */
export const evaluateTemplate: ExerciseTemplate = {
  id: "EVALUATE_EXPR",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const c = rng.int(2, 6);
    const d = rng.int(1, 9);
    const v = rng.int(2, 8);
    const answer = c * v + d;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: `Evaluá la expresión para x = ${v}.`,
      promptLatex: `${c}x + ${d}`,
      promptText: `${c}x + ${d}, x=${v}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["ORDER_OF_OPERATIONS"],
      hints: [
        "Reemplazá x por su valor y resolvé respetando el orden de operaciones.",
        `${c}·${v} + ${d}.`,
        `${c}·${v} = ${c * v}, y ${c * v} + ${d} = ${answer}.`,
      ],
      steps: [
        { latex: `${c}(${v}) + ${d} = ${c * v} + ${d}`, note: "Reemplazamos y multiplicamos primero." },
        { latex: `= ${answer}`, note: "Sumamos." },
      ],
    };
  },
};

export const algebraTemplates: ExerciseTemplate[] = [
  combineLikeTemplate,
  distributeTemplate,
  evaluateTemplate,
];
