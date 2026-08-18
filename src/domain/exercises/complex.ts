import { validateChoice } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "complejos";

/** Formatea un complejo re + im·i con signos correctos. */
function fmtC(re: number, im: number): string {
  if (im === 0) return `${re}`;
  const imPart = Math.abs(im) === 1 ? "i" : `${Math.abs(im)}i`;
  if (re === 0) return `${im < 0 ? "-" : ""}${imPart}`;
  return `${re} ${im < 0 ? "-" : "+"} ${imPart}`;
}

function nz(rng: Rng, lo: number, hi: number): number {
  let v = 0;
  while (v === 0) v = rng.int(lo, hi);
  return v;
}

/* COMPLEX_ADD — suma de complejos ---------------------------------------- */
export const complexAddTemplate: ExerciseTemplate = {
  id: "COMPLEX_ADD",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = nz(rng, -5, 5);
    const b = nz(rng, -5, 5);
    const c = nz(rng, -5, 5);
    const d = nz(rng, -5, 5);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: fmtC(a + c, b + d), correct: true },
      { latex: fmtC(a - c, b + d), correct: false },
      { latex: fmtC(a + c, b - d), correct: false },
      { latex: fmtC(a - c, b - d), correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Sumá los números complejos.",
      promptLatex: `(${fmtC(a, b)}) + (${fmtC(c, d)})`,
      promptText: `(${fmtC(a, b)}) + (${fmtC(c, d)})`,
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["COMPLEX_NUMBER_SIGN"],
      hints: [
        "Se suma parte real con parte real, y parte imaginaria con parte imaginaria (por separado).",
        `Real: ${a} + ${c}. Imaginaria: ${b} + ${d}.`,
        `Queda ${fmtC(a + c, b + d)}.`,
      ],
      steps: [
        { latex: `(${a} + ${c}) + (${b} + ${d})i`, note: "Agrupamos real e imaginaria." },
        { latex: `= ${fmtC(a + c, b + d)}`, note: "Operamos." },
      ],
    };
  },
};

/* I_POWER — potencias de i ------------------------------------------------ */
export const iPowerTemplate: ExerciseTemplate = {
  id: "I_POWER",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const n = rng.int(1, 12);
    const r = n % 4;
    const value = r === 1 ? "i" : r === 2 ? "-1" : r === 3 ? "-i" : "1";
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: "i", correct: value === "i" },
      { latex: "-1", correct: value === "-1" },
      { latex: "-i", correct: value === "-i" },
      { latex: "1", correct: value === "1" },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Calculá la potencia de i.",
      promptLatex: `i^{${n}}`,
      promptText: `i^${n}`,
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["COMPLEX_NUMBER_SIGN"],
      hints: [
        "Las potencias de i se repiten cada 4: i¹=i, i²=-1, i³=-i, i⁴=1, y vuelve a empezar.",
        `Dividí ${n} por 4 y mirá el resto: ${r === 0 ? "4 (o 0)" : r}.`,
        `i^${n} = ${value}.`,
      ],
      steps: [
        { latex: `${n} = 4\\cdot ${Math.floor(n / 4)} + ${r}`, note: "El resto al dividir por 4 define el valor." },
        { latex: `i^{${n}} = ${value}`, note: "Según el ciclo i, -1, -i, 1." },
      ],
    };
  },
};

/* COMPLEX_CONJUGATE — conjugado ------------------------------------------ */
export const complexConjugateTemplate: ExerciseTemplate = {
  id: "COMPLEX_CONJUGATE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = nz(rng, -6, 6);
    const b = nz(rng, -6, 6);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: fmtC(a, -b), correct: true },
      { latex: fmtC(-a, b), correct: false },
      { latex: fmtC(a, b), correct: false },
      { latex: fmtC(-a, -b), correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "¿Cuál es el conjugado?",
      promptLatex: fmtC(a, b),
      promptText: fmtC(a, b),
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["COMPLEX_NUMBER_SIGN"],
      hints: [
        "El conjugado de un complejo mantiene la parte real y le cambia el signo a la parte imaginaria.",
        `Cambiá el signo del término con i.`,
        `El conjugado es ${fmtC(a, -b)}.`,
      ],
      steps: [{ latex: `\\overline{${fmtC(a, b)}} = ${fmtC(a, -b)}`, note: "Se cambia el signo de la parte imaginaria." }],
    };
  },
};

export const complexTemplates: ExerciseTemplate[] = [complexAddTemplate, iPowerTemplate, complexConjugateTemplate];
