import { validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "porcentajes-proporciones";
const PCTS = [5, 10, 15, 20, 25, 50, 75];

/* PERCENT_OF — ¿cuánto es X% de N? ---------------------------------------- */
export const percentOfTemplate: ExerciseTemplate = {
  id: "PERCENT_OF",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const pct = rng.pick(PCTS);
    const n = rng.int(1, 12) * 20; // múltiplo de 20 ⇒ resultado entero
    const answer = (n * pct) / 100;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: `¿Cuánto es el ${pct}% de ${n}?`,
      promptLatex: `${pct}\\% \\text{ de } ${n}`,
      promptText: `${pct}% de ${n}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["ARITHMETIC_SLIP"],
      hints: [
        "Un porcentaje es una fracción sobre 100: X% de N es N × X ÷ 100.",
        `Calculá ${n} × ${pct} y dividí por 100.`,
        `${n} × ${pct} = ${n * pct}, y ${n * pct} ÷ 100 = ${answer}.`,
      ],
      steps: [
        { latex: `${pct}\\% = \\dfrac{${pct}}{100}`, note: "El porcentaje es una fracción sobre 100." },
        { latex: `\\dfrac{${pct}}{100} \\times ${n} = ${answer}`, note: "Multiplicamos por el total." },
      ],
    };
  },
};

/* PERCENT_INCREASE — N aumenta X% ----------------------------------------- */
export const percentIncreaseTemplate: ExerciseTemplate = {
  id: "PERCENT_INCREASE",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const pct = rng.pick([10, 20, 25, 50]);
    const n = rng.int(1, 10) * 20;
    const inc = (n * pct) / 100;
    const answer = n + inc;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: `Un precio de $${n} aumenta ${pct}%. ¿Cuál es el precio final?`,
      promptLatex: `${n} + ${pct}\\% \\text{ de } ${n}`,
      promptText: `${n} + ${pct}% de ${n}`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (ans): ErrorCategory[] => {
        const v = Number(ans.replace(",", "."));
        if (v === inc) return ["ARITHMETIC_SLIP"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Primero calculá el aumento (el porcentaje del total) y después sumalo al valor original.",
        `El aumento es el ${pct}% de ${n} = ${inc}.`,
        `${n} + ${inc} = ${answer}.`,
      ],
      steps: [
        { latex: `${pct}\\% \\text{ de } ${n} = ${inc}`, note: "Calculamos el aumento." },
        { latex: `${n} + ${inc} = ${answer}`, note: "Sumamos al precio original." },
      ],
    };
  },
};

/* PROPORTION — regla de tres ---------------------------------------------- */
export const proportionTemplate: ExerciseTemplate = {
  id: "PROPORTION",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const unit = rng.int(2, 9);
    const b = a * unit;
    const c = rng.int(2, 10);
    const answer = c * unit;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: `Si ${a} unidades cuestan $${b}, ¿cuánto cuestan ${c} unidades?`,
      promptLatex: `${a} \\to ${b}, \\quad ${c} \\to \\;?`,
      promptText: `${a} → ${b}, ${c} → ?`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["ARITHMETIC_SLIP"],
      hints: [
        "Regla de tres directa: primero buscá cuánto vale una unidad.",
        `Una unidad cuesta ${b} ÷ ${a} = ${unit}.`,
        `${c} × ${unit} = ${answer}.`,
      ],
      steps: [
        { latex: `\\dfrac{${b}}{${a}} = ${unit}`, note: "Valor de una unidad." },
        { latex: `${unit} \\times ${c} = ${answer}`, note: "Multiplicamos por la cantidad." },
      ],
    };
  },
};

export const percentageTemplates: ExerciseTemplate[] = [
  percentOfTemplate,
  percentIncreaseTemplate,
  proportionTemplate,
];
