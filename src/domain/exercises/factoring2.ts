import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "factorizacion-2";

/* TRINOMIAL_FACTOR — x^2 + (p+q)x + pq ------------------------------------ */
export const trinomialFactorTemplate: ExerciseTemplate = {
  id: "TRINOMIAL_FACTOR",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const p = rng.int(1, 6);
    const q = rng.int(1, 6);
    const sum = p + q;
    const prod = p * q;
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `(x + ${p})(x + ${q})`, correct: true },
      { latex: `(x - ${p})(x - ${q})`, correct: false },
      { latex: `(x + ${sum})(x + ${prod})`, correct: false },
      { latex: `(x + ${p})(x - ${q})`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "Factorizá el trinomio.",
      promptLatex: `x^2 + ${sum}x + ${prod}`,
      promptText: `x^2 + ${sum}x + ${prod}`,
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FACTORING_PATTERN"],
      hints: [
        "Buscá dos números que sumados den el coeficiente del medio y multiplicados den el término independiente.",
        `Dos números que sumen ${sum} y multipliquen ${prod}: ${p} y ${q}.`,
        `Queda (x + ${p})(x + ${q}).`,
      ],
      steps: [
        { latex: `${p} + ${q} = ${sum}, \\quad ${p}\\cdot ${q} = ${prod}`, note: "Suma y producto." },
        { latex: `x^2 + ${sum}x + ${prod} = (x + ${p})(x + ${q})`, note: "Factorizamos." },
      ],
    };
  },
};

/* RATIONAL_SIMPLIFY — (x^2 - a^2)/(x - a) = x + a ------------------------- */
export const rationalSimplifyTemplate: ExerciseTemplate = {
  id: "RATIONAL_SIMPLIFY",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 9);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `x + ${a}`, correct: true },
      { latex: `x - ${a}`, correct: false },
      { latex: `x`, correct: false },
      { latex: `${a}`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "Simplificá la expresión racional (x ≠ " + a + ").",
      promptLatex: `\\dfrac{x^2 - ${a * a}}{x - ${a}}`,
      promptText: `(x^2 - ${a * a})/(x - ${a})`,
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FACTORING_PATTERN"],
      hints: [
        "Factorizá el numerador: es una diferencia de cuadrados. Después cancelá el factor común con el denominador.",
        `x² - ${a * a} = (x + ${a})(x - ${a}).`,
        `Cancelás (x - ${a}) y queda x + ${a}.`,
      ],
      steps: [
        { latex: `\\dfrac{(x + ${a})(x - ${a})}{x - ${a}}`, note: "Factorizamos el numerador." },
        { latex: `= x + ${a}`, note: "Cancelamos el factor común." },
      ],
    };
  },
};

/* RATIONAL_DOMAIN — valor excluido --------------------------------------- */
export const rationalDomainTemplate: ExerciseTemplate = {
  id: "RATIONAL_DOMAIN",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(1, 9);
    const b = rng.int(1, 8);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "¿Qué valor de x hay que excluir del dominio?",
      promptLatex: `\\dfrac{x + ${b}}{x - ${a}}`,
      promptText: `(x+${b})/(x-${a})`,
      correctAnswerDisplay: String(a),
      validate: (ans) => validateNumeric(ans, a, 0),
      classifyError: (): ErrorCategory[] => ["DOMAIN_RESTRICTION"],
      hints: [
        "El denominador de una fracción nunca puede ser cero. Buscá qué valor de x lo anula.",
        `x - ${a} = 0 cuando x = ${a}.`,
        `Hay que excluir x = ${a}.`,
      ],
      steps: [
        { latex: `x - ${a} \\neq 0 \\;\\Rightarrow\\; x \\neq ${a}`, note: "El denominador no puede ser cero." },
      ],
    };
  },
};

export const factoring2Templates: ExerciseTemplate[] = [
  trinomialFactorTemplate,
  rationalSimplifyTemplate,
  rationalDomainTemplate,
];
