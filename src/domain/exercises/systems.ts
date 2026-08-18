import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "sistemas-ecuaciones";

function termY(b: number): string {
  const s = b < 0 ? "-" : "+";
  const abs = Math.abs(b);
  return `${s} ${abs === 1 ? "y" : `${abs}y`}`;
}

interface Sys {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  x: number;
  y: number;
}

function makeSystem(rng: Rng): Sys {
  let a: number, b: number, d: number, e: number;
  do {
    a = rng.int(1, 4);
    b = rng.int(-4, 4);
    d = rng.int(1, 4);
    e = rng.int(-4, 4);
  } while (b === 0 || e === 0 || a * e - b * d === 0);
  const x = rng.int(-4, 5);
  const y = rng.int(-4, 5);
  return { a, b, c: a * x + b * y, d, e, f: d * x + e * y, x, y };
}

function cases(s: Sys): string {
  return `\\begin{cases} ${s.a}x ${termY(s.b)} = ${s.c} \\\\ ${s.d}x ${termY(s.e)} = ${s.f} \\end{cases}`;
}

/* SYSTEM_SOLVE_X ---------------------------------------------------------- */
export const systemSolveXTemplate: ExerciseTemplate = {
  id: "SYSTEM_SOLVE_X",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const s = makeSystem(rng);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé el sistema. ¿Cuánto vale x?",
      promptLatex: cases(s),
      promptText: `sistema 2x2`,
      correctAnswerDisplay: String(s.x),
      validate: (ans) => validateNumeric(ans, s.x, 0),
      classifyError: (): ErrorCategory[] => ["SYSTEM_SUBSTITUTION"],
      hints: [
        "Podés usar sustitución o eliminación: despejá una variable en una ecuación y reemplazá en la otra.",
        "Sumá o restá las ecuaciones para cancelar una variable.",
        `La solución es x = ${s.x}, y = ${s.y}.`,
      ],
      steps: [
        { latex: cases(s), note: "Buscamos el par (x, y) que cumple ambas." },
        { latex: `x = ${s.x}, \\quad y = ${s.y}`, note: "Solución del sistema." },
      ],
    };
  },
};

/* SYSTEM_SOLVE_Y ---------------------------------------------------------- */
export const systemSolveYTemplate: ExerciseTemplate = {
  id: "SYSTEM_SOLVE_Y",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const s = makeSystem(rng);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé el sistema. ¿Cuánto vale y?",
      promptLatex: cases(s),
      promptText: `sistema 2x2`,
      correctAnswerDisplay: String(s.y),
      validate: (ans) => validateNumeric(ans, s.y, 0),
      classifyError: (): ErrorCategory[] => ["SYSTEM_ELIMINATION"],
      hints: [
        "Eliminá la x combinando las ecuaciones y te queda una ecuación con solo y.",
        "Igualá los coeficientes de x y restá las ecuaciones.",
        `La solución es x = ${s.x}, y = ${s.y}.`,
      ],
      steps: [
        { latex: cases(s), note: "Sistema a resolver." },
        { latex: `x = ${s.x}, \\quad y = ${s.y}`, note: "Solución." },
      ],
    };
  },
};

/* SYSTEM_SOLUTION_POINT — elegir el par solución ------------------------- */
export const systemSolutionPointTemplate: ExerciseTemplate = {
  id: "SYSTEM_SOLUTION_POINT",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    let s = makeSystem(rng);
    while (s.x === s.y) s = makeSystem(rng); // el swap no debe coincidir con la correcta
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: `x = ${s.x}, y = ${s.y}`, correct: true },
      { text: `x = ${s.y}, y = ${s.x}`, correct: false },
      { text: `x = ${s.x + 1}, y = ${s.y}`, correct: false },
      { text: `x = ${s.x}, y = ${s.y - 1}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "¿Cuál es la solución del sistema?",
      promptLatex: cases(s),
      promptText: `sistema 2x2`,
      options,
      correctAnswerDisplay: correctText,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["SYSTEM_SUBSTITUTION"],
      hints: [
        "La solución es el par (x, y) que verifica las dos ecuaciones a la vez.",
        "Probá reemplazar cada opción en ambas ecuaciones.",
        `La solución es x = ${s.x}, y = ${s.y}.`,
      ],
      steps: [{ latex: `x = ${s.x}, \\quad y = ${s.y}`, note: "Verifica ambas ecuaciones." }],
    };
  },
};

export const systemTemplates: ExerciseTemplate[] = [
  systemSolveXTemplate,
  systemSolveYTemplate,
  systemSolutionPointTemplate,
];
