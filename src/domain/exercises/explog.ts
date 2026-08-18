import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "exp-log";

/* LOG_EVAL — log_b(b^n) --------------------------------------------------- */
export const logEvalTemplate: ExerciseTemplate = {
  id: "LOG_EVAL",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const b = rng.pick([2, 3, 5, 10]);
    const n = rng.int(1, 4);
    const x = Math.pow(b, n);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Calculá el logaritmo.",
      promptLatex: `\\log_{${b}}(${x})`,
      promptText: `log base ${b} de ${x}`,
      correctAnswerDisplay: String(n),
      validate: (ans) => validateNumeric(ans, n, 0),
      classifyError: (): ErrorCategory[] => ["LOG_PROPERTY"],
      hints: [
        "El logaritmo pregunta: ¿a qué exponente hay que elevar la base para obtener ese número?",
        `¿${b} elevado a qué da ${x}?`,
        `${b}^${n} = ${x}, entonces el logaritmo es ${n}.`,
      ],
      steps: [
        { latex: `\\log_{${b}}(${x}) = n \\;\\Leftrightarrow\\; ${b}^{n} = ${x}`, note: "Definición de logaritmo." },
        { latex: `${b}^{${n}} = ${x} \\;\\Rightarrow\\; n = ${n}`, note: "Buscamos el exponente." },
      ],
    };
  },
};

/* EXP_SOLVE — b^x = k ----------------------------------------------------- */
export const expSolveTemplate: ExerciseTemplate = {
  id: "EXP_SOLVE",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const b = rng.pick([2, 3, 5]);
    const n = rng.int(2, 4);
    const k = Math.pow(b, n);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Resolvé la ecuación exponencial (despejá x).",
      promptLatex: `${b}^x = ${k}`,
      promptText: `${b}^x = ${k}`,
      correctAnswerDisplay: String(n),
      validate: (ans) => validateNumeric(ans, n, 0),
      classifyError: (): ErrorCategory[] => ["LOG_PROPERTY"],
      hints: [
        "Escribí el número de la derecha como una potencia de la misma base; si las bases son iguales, los exponentes son iguales.",
        `${k} = ${b}^{?}`,
        `${k} = ${b}^${n}, entonces x = ${n}.`,
      ],
      steps: [
        { latex: `${b}^x = ${b}^{${n}}`, note: "Igualamos las bases." },
        { latex: `x = ${n}`, note: "Igualamos los exponentes." },
      ],
    };
  },
};

/* LOG_PROPERTY — propiedades del logaritmo -------------------------------- */
export const logPropertyTemplate: ExerciseTemplate = {
  id: "LOG_PROPERTY",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const kind = rng.int(0, 2);
    let prompt: string;
    let entries: { latex: string; correct: boolean }[];
    if (kind === 0) {
      prompt = `\\log(a \\cdot b)`;
      entries = [
        { latex: `\\log a + \\log b`, correct: true },
        { latex: `\\log a - \\log b`, correct: false },
        { latex: `\\log a \\cdot \\log b`, correct: false },
        { latex: `\\log(a + b)`, correct: false },
      ];
    } else if (kind === 1) {
      prompt = `\\log\\left(\\dfrac{a}{b}\\right)`;
      entries = [
        { latex: `\\log a - \\log b`, correct: true },
        { latex: `\\log a + \\log b`, correct: false },
        { latex: `\\dfrac{\\log a}{\\log b}`, correct: false },
        { latex: `\\log(a - b)`, correct: false },
      ];
    } else {
      const n = rng.int(2, 5);
      prompt = `\\log(a^{${n}})`;
      entries = [
        { latex: `${n}\\log a`, correct: true },
        { latex: `\\log a + ${n}`, correct: false },
        { latex: `(\\log a)^{${n}}`, correct: false },
        { latex: `\\log(${n}a)`, correct: false },
      ];
    }
    const { options, correctId, correctLatex } = buildChoices(rng, entries);
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "Aplicá las propiedades del logaritmo.",
      promptLatex: prompt,
      promptText: "propiedad del logaritmo",
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["LOG_PROPERTY"],
      hints: [
        "El log de un producto es la suma de los logs; el de un cociente, la resta; y el de una potencia baja el exponente como factor.",
        "No confundas: log(a·b) no es log a · log b.",
        `La respuesta es ${correctLatex}.`,
      ],
      steps: [{ latex: `${prompt} = ${correctLatex}`, note: "Propiedad del logaritmo." }],
    };
  },
};

export const explogTemplates: ExerciseTemplate[] = [logEvalTemplate, expSolveTemplate, logPropertyTemplate];
