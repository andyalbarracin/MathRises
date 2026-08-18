import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "enteros-signos";

function sign(n: number): string {
  return n < 0 ? `(${n})` : `${n}`;
}

/* INTEGER_ADD — suma/resta con signo -------------------------------------- */
export const integerAddTemplate: ExerciseTemplate = {
  id: "INTEGER_ADD",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(-12, 12);
    let b = rng.int(-12, 12);
    while (b === 0) b = rng.int(-12, 12);
    const answer = a + b;
    const wrong = a - b;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Sumá los números enteros (cuidado con los signos).",
      promptLatex: `${a} + ${sign(b)}`,
      promptText: `${a} + (${b})`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === wrong || v === Math.abs(answer) * -Math.sign(answer)) return ["SIGN_ERROR"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Sumar un negativo es lo mismo que restar: a + (−b) = a − b.",
        b < 0
          ? `Como el segundo número es negativo, en realidad restás: ${a} − ${Math.abs(b)}.`
          : `Los dos aportan en la misma dirección: ${a} + ${b}.`,
        `El resultado es ${answer}.`,
      ],
      steps: [
        {
          latex: `${a} + ${sign(b)} = ${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`,
          note: "Reescribimos según el signo.",
        },
        { latex: `= ${answer}`, note: "Operamos." },
      ],
    };
  },
};

/* INTEGER_MULT — producto con signo --------------------------------------- */
export const integerMultTemplate: ExerciseTemplate = {
  id: "INTEGER_MULT",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    let a = rng.int(-9, 9);
    let b = rng.int(-9, 9);
    while (a === 0) a = rng.int(-9, 9);
    while (b === 0) b = rng.int(-9, 9);
    const answer = a * b;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Multiplicá y prestá atención al signo del resultado.",
      promptLatex: `${sign(a)} \\times ${sign(b)}`,
      promptText: `(${a}) × (${b})`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === -answer) return ["SIGN_ERROR"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Regla de signos: igual por igual da (+), distinto por distinto da (−).",
        `${a < 0 === b < 0 ? "Los signos son iguales: el resultado es positivo." : "Los signos son distintos: el resultado es negativo."}`,
        `El resultado es ${answer}.`,
      ],
      steps: [
        {
          latex: `${sign(a)} \\times ${sign(b)} = ${answer}`,
          note: a < 0 === b < 0 ? "Signos iguales → positivo." : "Signos distintos → negativo.",
        },
      ],
    };
  },
};

/* INTEGER_COMPARE — ¿cuál es mayor? (opción) ------------------------------ */
export const integerCompareTemplate: ExerciseTemplate = {
  id: "INTEGER_COMPARE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(-10, 10);
    let b = rng.int(-10, 10);
    while (a === b) b = rng.int(-10, 10);
    const options = [
      { id: "0", text: String(a) },
      { id: "1", text: String(b) },
    ];
    const correctId = a > b ? "0" : "1";
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "¿Cuál de los dos números es mayor?",
      promptLatex: `${a} \\quad \\text{vs} \\quad ${b}`,
      promptText: `${a} vs ${b}`,
      options,
      correctAnswerDisplay: String(Math.max(a, b)),
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["SIGN_ERROR"],
      hints: [
        "En la recta numérica, más a la derecha es mayor. Los negativos van a la izquierda del 0.",
        "Entre dos negativos, el que está más cerca del 0 es el mayor.",
        `El mayor es ${Math.max(a, b)}.`,
      ],
      steps: [
        {
          latex: `${Math.max(a, b)} > ${Math.min(a, b)}`,
          note: "Comparamos su posición en la recta numérica.",
        },
      ],
    };
  },
};

/* INTEGER_SUBTRACT — resta con signo -------------------------------------- */
export const integerSubtractTemplate: ExerciseTemplate = {
  id: "INTEGER_SUBTRACT",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(-12, 12);
    let b = rng.int(-12, 12);
    while (b === 0) b = rng.int(-12, 12);
    const answer = a - b;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Restá los números enteros (cuidado con los signos).",
      promptLatex: `${a} - ${sign(b)}`,
      promptText: `${a} - (${b})`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === a + b) return ["SIGN_ERROR"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Restar un negativo es sumar: a − (−b) = a + b.",
        b < 0 ? `Como restás un negativo, en realidad sumás: ${a} + ${Math.abs(b)}.` : `Es una resta común: ${a} − ${b}.`,
        `El resultado es ${answer}.`,
      ],
      steps: [
        { latex: `${a} - ${sign(b)} = ${a} ${b < 0 ? "+" : "-"} ${Math.abs(b)}`, note: "Reescribimos según el signo." },
        { latex: `= ${answer}`, note: "Operamos." },
      ],
    };
  },
};

/* INTEGER_TRIPLE — a + b - c ---------------------------------------------- */
export const integerTripleTemplate: ExerciseTemplate = {
  id: "INTEGER_TRIPLE",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(-9, 9);
    const b = rng.int(-9, 9);
    const c = rng.int(-9, 9);
    const answer = a + b - c;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé de izquierda a derecha, con cuidado en los signos.",
      promptLatex: `${a} + ${sign(b)} - ${sign(c)}`,
      promptText: `${a} + (${b}) - (${c})`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["SIGN_ERROR"],
      hints: [
        "Sumar un negativo es restar; restar un negativo es sumar. Operá de a dos.",
        `${a} + ${sign(b)} = ${a + b}.`,
        `${a + b} - ${sign(c)} = ${answer}.`,
      ],
      steps: [
        { latex: `${a} + ${sign(b)} = ${a + b}`, note: "Primer paso." },
        { latex: `${a + b} - ${sign(c)} = ${answer}`, note: "Segundo paso." },
      ],
    };
  },
};

export const integerTemplates: ExerciseTemplate[] = [
  integerAddTemplate,
  integerSubtractTemplate,
  integerMultTemplate,
  integerTripleTemplate,
  integerCompareTemplate,
];
