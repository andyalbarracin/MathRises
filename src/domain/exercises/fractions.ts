import {
  addFractions,
  fractionsEqual,
  gcd,
  lcm,
  parseFraction,
  simplify,
  toLatex,
  type Fraction,
} from "@/domain/math/fraction";
import { validateChoice, validateFraction } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "fracciones-basicas";

/* -------------------------------------------------------------------------- */
/* FRACTION_ADD — suma de fracciones con distinto denominador                 */
/* -------------------------------------------------------------------------- */

export const fractionAddTemplate: ExerciseTemplate = {
  id: "FRACTION_ADD",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const b = rng.int(2, 8);
    let d = rng.int(2, 8);
    while (d === b) d = rng.int(2, 8);
    const a = rng.int(1, b + 2);
    const c = rng.int(1, d + 2);
    const f1: Fraction = { n: a, d: b };
    const f2: Fraction = { n: c, d: d };
    const answer = addFractions(f1, f2);
    const wrongDenomSum = simplify({ n: a + c, d: b + d });

    const promptLatex = `${toLatex(f1)} + ${toLatex(f2)}`;
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Resolvé la suma y escribí el resultado en su mínima expresión.",
      promptLatex,
      promptText: `${a}/${b} + ${c}/${d}`,
      correctAnswerDisplay: `${answer.n}/${answer.d}`,
      validate: (ans) => validateFraction(ans, answer, true),
      classifyError: (ans): ErrorCategory[] => {
        const p = parseFraction(ans);
        if (!p) return ["UNKNOWN"];
        if (fractionsEqual(p, wrongDenomSum) && !fractionsEqual(answer, wrongDenomSum)) {
          return ["FRACTION_COMMON_DENOMINATOR"];
        }
        if (fractionsEqual(p, answer)) return ["FRACTION_NOT_SIMPLIFIED"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Para sumar fracciones necesitás un denominador común: no se suman los denominadores.",
        `Un denominador común es ${lcm(b, d)}. Convertí ambas fracciones a ese denominador antes de sumar.`,
        `${a}/${b} = ${(a * (lcm(b, d) / b))}/${lcm(b, d)} y ${c}/${d} = ${(c * (lcm(b, d) / d))}/${lcm(b, d)}. Ahora sumá los numeradores.`,
      ],
      steps: buildAddSteps(f1, f2, answer),
    };
  },
};

function buildAddSteps(f1: Fraction, f2: Fraction, answer: Fraction) {
  const m = lcm(f1.d, f2.d);
  const n1 = f1.n * (m / f1.d);
  const n2 = f2.n * (m / f2.d);
  const sum = { n: n1 + n2, d: m };
  const steps = [
    {
      latex: `\\text{m.c.m.}(${f1.d}, ${f2.d}) = ${m}`,
      note: "Buscamos un denominador común.",
    },
    {
      latex: `${toLatex(f1)} + ${toLatex(f2)} = \\dfrac{${n1}}{${m}} + \\dfrac{${n2}}{${m}}`,
      note: "Convertimos a denominador común.",
    },
    {
      latex: `= \\dfrac{${n1 + n2}}{${m}}`,
      note: "Sumamos los numeradores; el denominador no cambia.",
    },
  ];
  if (!fractionsEqual(sum, answer) || sum.n !== answer.n || sum.d !== answer.d) {
    steps.push({
      latex: `= ${toLatex(answer)}`,
      note: "Simplificamos a la mínima expresión.",
    });
  }
  return steps;
}

/* -------------------------------------------------------------------------- */
/* FRACTION_SIMPLIFY — reducir a mínima expresión                             */
/* -------------------------------------------------------------------------- */

export const fractionSimplifyTemplate: ExerciseTemplate = {
  id: "FRACTION_SIMPLIFY",
  conceptId: CONCEPT_ID,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    // Fracción reducida objetivo, luego se "des-simplifica" por k.
    const bn = rng.int(1, 6);
    let bd = rng.int(2, 7);
    while (gcd(bn, bd) !== 1) bd = rng.int(2, 7);
    const k = rng.int(2, 6);
    const shown: Fraction = { n: bn * k, d: bd * k };
    const answer = simplify(shown);

    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Escribí esta fracción en su mínima expresión.",
      promptLatex: toLatex(shown),
      promptText: `${shown.n}/${shown.d}`,
      correctAnswerDisplay: `${answer.n}/${answer.d}`,
      validate: (ans) => validateFraction(ans, answer, true),
      classifyError: (ans): ErrorCategory[] => {
        const p = parseFraction(ans);
        if (!p) return ["UNKNOWN"];
        if (fractionsEqual(p, answer)) return ["FRACTION_NOT_SIMPLIFIED"];
        return ["ARITHMETIC_SLIP"];
      },
      hints: [
        "Simplificar es dividir numerador y denominador por su factor común mayor.",
        `El máximo común divisor de ${shown.n} y ${shown.d} es ${gcd(shown.n, shown.d)}.`,
        `Dividí ambos por ${gcd(shown.n, shown.d)} para llegar a la mínima expresión.`,
      ],
      steps: [
        {
          latex: `\\gcd(${shown.n}, ${shown.d}) = ${gcd(shown.n, shown.d)}`,
          note: "Buscamos el máximo común divisor.",
        },
        {
          latex: `\\dfrac{${shown.n}}{${shown.d}} = ${toLatex(answer)}`,
          note: "Dividimos numerador y denominador por ese divisor.",
        },
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/* FRACTION_EQUIVALENCE — elegir la fracción equivalente (multiple choice)    */
/* -------------------------------------------------------------------------- */

export const fractionEquivalenceTemplate: ExerciseTemplate = {
  id: "FRACTION_EQUIVALENCE",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const bn = rng.int(1, 5);
    let bd = rng.int(2, 6);
    while (gcd(bn, bd) !== 1) bd = rng.int(2, 6);
    const base: Fraction = { n: bn, d: bd };
    const k = rng.int(2, 5);
    const correct: Fraction = { n: bn * k, d: bd * k };

    const distractors: Fraction[] = [
      { n: bn * k + 1, d: bd * k }, // numerador corrido
      { n: bn + k, d: bd + k }, // sumó en vez de multiplicar
      { n: bn * k, d: bd * k + 1 }, // denominador corrido
    ];

    const raw = [
      { f: correct, correct: true },
      ...distractors.map((f) => ({ f, correct: false })),
    ];
    // Baraja determinista.
    for (let i = raw.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    const options = raw.map((o, i) => ({ id: String(i), latex: toLatex(o.f) }));
    const correctId = String(raw.findIndex((o) => o.correct));

    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "¿Cuál de estas fracciones es equivalente?",
      promptLatex: toLatex(base),
      promptText: `${base.n}/${base.d}`,
      options,
      correctAnswerDisplay: toLatex(correct),
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["ARITHMETIC_SLIP"],
      hints: [
        "Dos fracciones son equivalentes si multiplicás (o dividís) numerador y denominador por el mismo número.",
        `Probá multiplicar ${base.n}/${base.d} por ${k}/${k}.`,
        `${base.n} × ${k} = ${base.n * k} y ${base.d} × ${k} = ${base.d * k}.`,
      ],
      steps: [
        {
          latex: `${toLatex(base)} \\times \\dfrac{${k}}{${k}} = ${toLatex(correct)}`,
          note: "Multiplicamos numerador y denominador por el mismo factor.",
        },
      ],
    };
  },
};

/* -------------------------------------------------------------------------- */
/* FRACTION_ERROR_SPOTTING — identificar el error en una suma mal resuelta    */
/* -------------------------------------------------------------------------- */

export const fractionErrorSpottingTemplate: ExerciseTemplate = {
  id: "FRACTION_ERROR_SPOTTING",
  conceptId: CONCEPT_ID,
  cardType: "ERROR_SPOTTING",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const b = rng.int(2, 6);
    let d = rng.int(2, 6);
    while (d === b) d = rng.int(2, 6);
    const a = rng.int(1, b);
    const c = rng.int(1, d);
    const wrong = { n: a + c, d: b + d };

    const { options, correctId, correctText } = buildChoices(rng, [
      { text: "Sumaron los denominadores en lugar de buscar denominador común.", correct: true },
      { text: "Se equivocaron al simplificar el resultado final.", correct: false },
      { text: "Invirtieron una de las fracciones antes de sumar.", correct: false },
      { text: "No hay ningún error, la solución es correcta.", correct: false },
    ]);

    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "ERROR_SPOTTING",
      difficulty: "medium",
      instruction: "Esta resolución tiene un error. ¿Cuál es?",
      promptLatex: `\\dfrac{${a}}{${b}} + \\dfrac{${c}}{${d}} = \\dfrac{${a}+${c}}{${b}+${d}} = \\dfrac{${wrong.n}}{${wrong.d}}`,
      promptText: `${a}/${b} + ${c}/${d} = ${wrong.n}/${wrong.d}`,
      options,
      correctAnswerDisplay: correctText,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["FRACTION_COMMON_DENOMINATOR"],
      hints: [
        "Fijate en el paso donde combinan los denominadores.",
        "Los denominadores no se suman al sumar fracciones.",
        "Hay que llevar ambas fracciones a un denominador común primero.",
      ],
      steps: [
        {
          latex: `\\dfrac{${a}}{${b}} + \\dfrac{${c}}{${d}} = \\dfrac{${a * (lcm(b, d) / b)} + ${c * (lcm(b, d) / d)}}{${lcm(b, d)}}`,
          note: "Lo correcto es usar el denominador común, no sumar los denominadores.",
        },
      ],
    };
  },
};

export const fractionTemplates: ExerciseTemplate[] = [
  fractionAddTemplate,
  fractionSimplifyTemplate,
  fractionEquivalenceTemplate,
  fractionErrorSpottingTemplate,
];
