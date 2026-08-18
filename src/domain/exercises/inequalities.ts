import { validateChoice } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "inecuaciones";

/* SOLVE_INEQ — ax < c (a > 0) --------------------------------------------- */
export const solveIneqTemplate: ExerciseTemplate = {
  id: "SOLVE_INEQ",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const x0 = rng.int(2, 9);
    const c = a * x0;
    const op = rng.pick(["<", ">"]);
    const inv = op === "<" ? ">" : "<";
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `x ${op} ${x0}`, correct: true },
      { latex: `x ${inv} ${x0}`, correct: false },
      { latex: `x ${op} ${c}`, correct: false },
      { latex: `x ${op} ${c - a}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Resolvé la inecuación.",
      promptLatex: `${a}x ${op} ${c}`,
      promptText: `${a}x ${op} ${c}`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["INEQUALITY_SIGN_FLIP"],
      hints: [
        "Se despeja como una ecuación. Como dividimos por un número positivo, el sentido de la desigualdad no cambia.",
        `Dividí ambos lados por ${a}: x ${op} ${c} ÷ ${a}.`,
        `x ${op} ${x0}.`,
      ],
      steps: [
        { latex: `x ${op} \\dfrac{${c}}{${a}}`, note: "Dividimos por el coeficiente positivo." },
        { latex: `x ${op} ${x0}`, note: "El sentido no cambia (dividimos por positivo)." },
      ],
    };
  },
};

/* INEQ_SIGN_FLIP — -x > b (cambia el sentido) ----------------------------- */
export const ineqFlipTemplate: ExerciseTemplate = {
  id: "INEQ_SIGN_FLIP",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const b = rng.int(2, 9);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `x < -${b}`, correct: true },
      { latex: `x > -${b}`, correct: false },
      { latex: `x > ${b}`, correct: false },
      { latex: `x < ${b}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "Resolvé (ojo con el signo).",
      promptLatex: `-x > ${b}`,
      promptText: `-x > ${b}`,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["INEQUALITY_SIGN_FLIP"],
      hints: [
        "Cuando multiplicás o dividís por un número negativo, el sentido de la desigualdad se invierte.",
        "Multiplicá ambos lados por -1 y dá vuelta el signo > por <.",
        `Queda x < -${b}.`,
      ],
      steps: [
        { latex: `-x > ${b} \\;\\Rightarrow\\; x < -${b}`, note: "Multiplicamos por -1 e invertimos el sentido." },
      ],
    };
  },
};

/* INTERVAL — expresar en intervalo ---------------------------------------- */
export const intervalTemplate: ExerciseTemplate = {
  id: "INTERVAL_NOTATION",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(1, 9);
    const greater = rng.pick([true, false]);
    const prompt = greater ? `x > ${a}` : `x < ${a}`;
    const correct = greater ? `(${a},\\; +\\infty)` : `(-\\infty,\\; ${a})`;
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: correct, correct: true },
      { latex: greater ? `(-\\infty,\\; ${a})` : `(${a},\\; +\\infty)`, correct: false },
      { latex: greater ? `[${a},\\; +\\infty)` : `(-\\infty,\\; ${a}]`, correct: false },
      { latex: `[${a},\\; ${a + 3}]`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Expresá la solución como intervalo.",
      promptLatex: prompt,
      promptText: prompt,
      options,
      correctAnswerDisplay: correctLatex,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["INTERVAL_NOTATION"],
      hints: [
        "El infinito siempre lleva paréntesis (nunca corchete). El corchete se usa solo cuando el número está incluido (≤ o ≥).",
        greater ? "x > a empieza justo después de a y sigue hasta +∞." : "x < a va desde -∞ hasta a.",
        `Queda ${greater ? `(${a}, +∞)` : `(-∞, ${a})`}.`,
      ],
      steps: [{ latex: `${prompt} \\;\\Rightarrow\\; ${correct}`, note: "Paréntesis abierto: el extremo no se incluye." }],
    };
  },
};

export const inequalityTemplates: ExerciseTemplate[] = [
  solveIneqTemplate,
  ineqFlipTemplate,
  intervalTemplate,
];
