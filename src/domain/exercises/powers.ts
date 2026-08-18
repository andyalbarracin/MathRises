import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "potencias-radicales";

/* POWER_EVAL — b^n --------------------------------------------------------- */
export const powerEvalTemplate: ExerciseTemplate = {
  id: "POWER_EVAL",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const base = rng.int(2, 6);
    const exp = rng.int(2, 4);
    const answer = Math.pow(base, exp);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Resolvé la potencia.",
      promptLatex: `${base}^{${exp}}`,
      promptText: `${base}^${exp}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === base * exp) return ["EXPONENT_RULE"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Una potencia es multiplicar la base por sí misma tantas veces como diga el exponente. No es base × exponente.",
        `${base}^${exp} = ${Array(exp).fill(base).join(" × ")}.`,
        `El resultado es ${answer}.`,
      ],
      steps: [
        { latex: `${base}^{${exp}} = ${Array(exp).fill(base).join(" \\times ")}`, note: "Multiplicamos la base por sí misma." },
        { latex: `= ${answer}`, note: "Operamos." },
      ],
    };
  },
};

/* ROOT_EVAL — raíz cuadrada de un cuadrado perfecto ----------------------- */
export const rootEvalTemplate: ExerciseTemplate = {
  id: "ROOT_EVAL",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const root = rng.int(2, 13);
    const square = root * root;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Calculá la raíz cuadrada.",
      promptLatex: `\\sqrt{${square}}`,
      promptText: `√${square}`,
      correctAnswerDisplay: String(root),
      validate: (ans) => validateNumeric(ans, root, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === square / 2) return ["RADICAL_SIMPLIFICATION"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "La raíz cuadrada pregunta: ¿qué número multiplicado por sí mismo da este valor?",
        `Buscá un número que al cuadrado dé ${square}.`,
        `${root} × ${root} = ${square}, así que √${square} = ${root}.`,
      ],
      steps: [
        { latex: `${root} \\times ${root} = ${square}`, note: "Buscamos el número cuyo cuadrado es el radicando." },
        { latex: `\\sqrt{${square}} = ${root}`, note: "Esa es la raíz." },
      ],
    };
  },
};

/* POWER_PRODUCT — x^a · x^b (propiedad) ------------------------------------ */
export const powerProductTemplate: ExerciseTemplate = {
  id: "POWER_PRODUCT",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    let b = rng.int(2, 6);
    while (b === a) b = rng.int(2, 6);
    const raw = [
      { latex: `x^{${a + b}}`, correct: true },
      { latex: `x^{${a * b}}`, correct: false },
      { latex: `x^{${a}}`, correct: false },
    ];
    for (let i = raw.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    const options = raw.map((o, i) => ({ id: String(i), latex: o.latex }));
    const correctId = String(raw.findIndex((o) => o.correct));
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Aplicá las propiedades de potencias.",
      promptLatex: `x^{${a}} \\cdot x^{${b}}`,
      promptText: `x^${a} · x^${b}`,
      options,
      correctAnswerDisplay: `x^{${a + b}}`,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["EXPONENT_RULE"],
      hints: [
        "Cuando se multiplican potencias de igual base, los exponentes se suman (no se multiplican).",
        `Sumá los exponentes: ${a} + ${b}.`,
        `x^${a} · x^${b} = x^{${a + b}}.`,
      ],
      steps: [
        { latex: `x^{${a}} \\cdot x^{${b}} = x^{${a}+${b}} = x^{${a + b}}`, note: "Misma base: se suman los exponentes." },
      ],
    };
  },
};

/* POWER_NEG_BASE — (-b)^n -------------------------------------------------- */
export const powerNegBaseTemplate: ExerciseTemplate = {
  id: "POWER_NEG_BASE",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const base = rng.int(2, 5);
    const exp = rng.int(2, 3);
    const answer = Math.pow(-base, exp);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé la potencia (atención al signo).",
      promptLatex: `(-${base})^{${exp}}`,
      promptText: `(-${base})^${exp}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === -answer) return ["SIGN_ERROR"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Una base negativa elevada a exponente par da positivo; a exponente impar, negativo.",
        `${exp % 2 === 0 ? "El exponente es par: el resultado es positivo." : "El exponente es impar: el resultado es negativo."}`,
        `(-${base})^${exp} = ${answer}.`,
      ],
      steps: [
        {
          latex: `(-${base})^{${exp}} = ${Array(exp).fill(`(-${base})`).join(" \\times ")}`,
          note: "Multiplicamos la base por sí misma.",
        },
        { latex: `= ${answer}`, note: exp % 2 === 0 ? "Exponente par → positivo." : "Exponente impar → negativo." },
      ],
    };
  },
};

export const powerTemplates: ExerciseTemplate[] = [
  powerEvalTemplate,
  rootEvalTemplate,
  powerNegBaseTemplate,
  powerProductTemplate,
];
