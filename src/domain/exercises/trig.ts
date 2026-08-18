import { validateChoice, validateNumeric } from "@/domain/validation";
import { gcd } from "@/domain/math/fraction";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
];

function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const a = n / g;
  const b = d / g;
  return b === 1 ? `${a}` : `\\frac{${a}}{${b}}`;
}

/* ======================= TRIGONOMETRÍA I (trig-i) ======================= */
const TRIG1 = "trig-i";

export const trigRatioTemplate: ExerciseTemplate = {
  id: "TRIG_RATIO",
  conceptId: TRIG1,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const [p, q, c] = rng.pick(TRIPLES);
    const swap = rng.pick([true, false]);
    const adj = swap ? p : q; // cateto horizontal (adyacente a θ)
    const opp = swap ? q : p; // cateto vertical (opuesto a θ)
    const fn = rng.pick(["sen", "cos", "tan"] as const);
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: frac(opp, c), correct: fn === "sen" },
      { latex: frac(adj, c), correct: fn === "cos" },
      { latex: frac(opp, adj), correct: fn === "tan" },
      { latex: frac(adj, opp), correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: TRIG1,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: `¿Cuál es el ${fn} del ángulo θ?`,
      promptLatex: "",
      promptText: `${fn}(θ), catetos ${adj} y ${opp}, hipotenusa ${c}`,
      correctAnswerDisplay: correctLatex,
      diagram: { kind: "right-triangle", legA: adj, legB: opp, labelA: `${adj}`, labelB: `${opp}`, labelC: `${c}`, markAngle: true },
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["TRIG_RATIO"],
      hints: [
        "Recordá: seno = opuesto/hipotenusa, coseno = adyacente/hipotenusa, tangente = opuesto/adyacente.",
        `Respecto de θ: el cateto opuesto es ${opp}, el adyacente es ${adj} y la hipotenusa es ${c}.`,
        `${fn}(θ) = ${correctLatex}.`,
      ],
      steps: [
        {
          latex:
            fn === "sen"
              ? `\\text{sen}(θ) = \\dfrac{\\text{op}}{\\text{hip}} = \\dfrac{${opp}}{${c}}`
              : fn === "cos"
                ? `\\cos(θ) = \\dfrac{\\text{ady}}{\\text{hip}} = \\dfrac{${adj}}{${c}}`
                : `\\tan(θ) = \\dfrac{\\text{op}}{\\text{ady}} = \\dfrac{${opp}}{${adj}}`,
          note: "Aplicamos la definición.",
        },
      ],
    };
  },
};

const SPECIAL: { f: string; a: string; v: string }[] = [
  { f: "sen", a: "30°", v: "\\frac{1}{2}" },
  { f: "sen", a: "45°", v: "\\frac{\\sqrt{2}}{2}" },
  { f: "sen", a: "60°", v: "\\frac{\\sqrt{3}}{2}" },
  { f: "sen", a: "90°", v: "1" },
  { f: "sen", a: "0°", v: "0" },
  { f: "cos", a: "0°", v: "1" },
  { f: "cos", a: "30°", v: "\\frac{\\sqrt{3}}{2}" },
  { f: "cos", a: "45°", v: "\\frac{\\sqrt{2}}{2}" },
  { f: "cos", a: "60°", v: "\\frac{1}{2}" },
  { f: "cos", a: "90°", v: "0" },
  { f: "tan", a: "0°", v: "0" },
  { f: "tan", a: "45°", v: "1" },
  { f: "tan", a: "60°", v: "\\sqrt{3}" },
];
const SPECIAL_VALUES = Array.from(new Set(SPECIAL.map((s) => s.v)));

export const trigSpecialTemplate: ExerciseTemplate = {
  id: "TRIG_SPECIAL_ANGLE",
  conceptId: TRIG1,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const row = rng.pick(SPECIAL);
    const distract = SPECIAL_VALUES.filter((v) => v !== row.v);
    // toma 3 distractores distintos
    for (let i = distract.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [distract[i], distract[j]] = [distract[j], distract[i]];
    }
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: row.v, correct: true },
      { latex: distract[0], correct: false },
      { latex: distract[1], correct: false },
      { latex: distract[2], correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: TRIG1,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: `¿Cuánto vale ${row.f}(${row.a})?`,
      promptLatex: `\\text{${row.f}}(${row.a})`,
      promptText: `${row.f}(${row.a})`,
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["TRIG_RATIO"],
      hints: [
        "Estos son los valores exactos de los ángulos notables (0°, 30°, 45°, 60°, 90°). Conviene memorizarlos.",
        "Recordá el triángulo de 45° (lados iguales) y el de 30°-60°.",
        `${row.f}(${row.a}) = ${row.v}.`,
      ],
      steps: [{ latex: `\\text{${row.f}}(${row.a}) = ${row.v}`, note: "Valor de ángulo notable." }],
    };
  },
};

export const trigDefinitionTemplate: ExerciseTemplate = {
  id: "TRIG_DEFINITION",
  conceptId: TRIG1,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const fn = rng.pick(["seno", "coseno", "tangente"] as const);
    const D_SIN = "cateto opuesto / hipotenusa";
    const D_COS = "cateto adyacente / hipotenusa";
    const D_TAN = "cateto opuesto / cateto adyacente";
    const correctText = fn === "seno" ? D_SIN : fn === "coseno" ? D_COS : D_TAN;
    const { options, correctId } = buildChoices(rng, [
      { text: D_SIN, correct: fn === "seno" },
      { text: D_COS, correct: fn === "coseno" },
      { text: D_TAN, correct: fn === "tangente" },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: TRIG1,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: `En un triángulo rectángulo, ¿cómo se define el ${fn} del ángulo θ?`,
      promptLatex: "",
      promptText: `definición de ${fn}`,
      correctAnswerDisplay: correctText,
      diagram: { kind: "right-triangle", legA: 4, legB: 3, labelA: "ady", labelB: "op", labelC: "hip", markAngle: true },
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["TRIG_RATIO"],
      hints: [
        "Pensá 'SOH-CAH-TOA': Seno-Opuesto-Hipotenusa, Coseno-Adyacente-Hipotenusa, Tangente-Opuesto-Adyacente.",
        "El opuesto es el cateto que no toca al ángulo; el adyacente sí lo toca.",
        `El ${fn} es ${correctText}.`,
      ],
      steps: [{ latex: `\\text{${fn}} = \\dfrac{\\text{...}}{\\text{...}}`, note: `${fn}: ${correctText}.` }],
    };
  },
};

export const trigITemplates: ExerciseTemplate[] = [trigRatioTemplate, trigSpecialTemplate, trigDefinitionTemplate];

/* ======================= TRIGONOMETRÍA II (trig-ii) ===================== */
const TRIG2 = "trig-ii";

const RADS: { d: number; r: string }[] = [
  { d: 30, r: "\\frac{\\pi}{6}" },
  { d: 45, r: "\\frac{\\pi}{4}" },
  { d: 60, r: "\\frac{\\pi}{3}" },
  { d: 90, r: "\\frac{\\pi}{2}" },
  { d: 120, r: "\\frac{2\\pi}{3}" },
  { d: 135, r: "\\frac{3\\pi}{4}" },
  { d: 150, r: "\\frac{5\\pi}{6}" },
  { d: 180, r: "\\pi" },
];
const RAD_LATEX = RADS.map((x) => x.r);

export const degToRadTemplate: ExerciseTemplate = {
  id: "DEG_TO_RAD",
  conceptId: TRIG2,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const row = rng.pick(RADS);
    const distract = RAD_LATEX.filter((r) => r !== row.r);
    for (let i = distract.length - 1; i > 0; i--) {
      const j = rng.int(0, i);
      [distract[i], distract[j]] = [distract[j], distract[i]];
    }
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: row.r, correct: true },
      { latex: distract[0], correct: false },
      { latex: distract[1], correct: false },
      { latex: distract[2], correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: TRIG2,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: `Convertí ${row.d}° a radianes.`,
      promptLatex: `${row.d}°`,
      promptText: `${row.d}° a radianes`,
      correctAnswerDisplay: correctLatex,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["DEGREE_RADIAN"],
      hints: [
        "Para pasar de grados a radianes se multiplica por π/180.",
        `${row.d}° × π/180, y después simplificás la fracción.`,
        `${row.d}° = ${row.r} rad.`,
      ],
      steps: [{ latex: `${row.d}° \\times \\dfrac{\\pi}{180} = ${row.r}`, note: "Multiplicamos por π/180 y simplificamos." }],
    };
  },
};

export const radToDegTemplate: ExerciseTemplate = {
  id: "RAD_TO_DEG",
  conceptId: TRIG2,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const row = rng.pick(RADS);
    return {
      id: `${this.id}-${index}`,
      conceptId: TRIG2,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Convertí a grados (respondé solo el número).",
      promptLatex: `${row.r} \\text{ rad}`,
      promptText: `${row.r} rad a grados`,
      correctAnswerDisplay: String(row.d),
      validate: (ans) => validateNumeric(ans, row.d, 0),
      classifyError: (): ErrorCategory[] => ["DEGREE_RADIAN"],
      hints: [
        "Para pasar de radianes a grados se multiplica por 180/π (el π se cancela).",
        "Reemplazá π por 180° en la expresión.",
        `Da ${row.d}°.`,
      ],
      steps: [{ latex: `${row.r} \\times \\dfrac{180}{\\pi} = ${row.d}°`, note: "Multiplicamos por 180/π." }],
    };
  },
};

export const lawChoiceTemplate: ExerciseTemplate = {
  id: "LAW_CHOICE",
  conceptId: TRIG2,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const cases = [
      { desc: "Conocés dos lados y el ángulo comprendido entre ellos.", law: "coseno" },
      { desc: "Conocés dos ángulos y un lado.", law: "seno" },
      { desc: "Conocés los tres lados.", law: "coseno" },
      { desc: "Conocés un lado, su ángulo opuesto y otro ángulo.", law: "seno" },
    ];
    const cse = rng.pick(cases);
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: "Teorema del seno", correct: cse.law === "seno" },
      { text: "Teorema del coseno", correct: cse.law === "coseno" },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: TRIG2,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: `${cse.desc} ¿Qué teorema conviene usar?`,
      promptLatex: "",
      promptText: cse.desc,
      correctAnswerDisplay: correctText,
      diagram: { kind: "triangle-angles", a: "", b: "", c: "" },
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["SINE_COSINE_LAW"],
      hints: [
        "Teorema del coseno: cuando tenés dos lados y el ángulo entre ellos, o los tres lados. Teorema del seno: cuando tenés un lado con su ángulo opuesto.",
        cse.law === "coseno" ? "Hay un ángulo entre lados o están los tres lados: coseno." : "Hay pares lado–ángulo opuesto: seno.",
        `Conviene el teorema del ${cse.law}.`,
      ],
      steps: [{ latex: `\\text{Teorema del } ${cse.law}`, note: cse.desc }],
    };
  },
};

export const trigIITemplates: ExerciseTemplate[] = [degToRadTemplate, radToDegTemplate, lawChoiceTemplate];

export const trigTemplates: ExerciseTemplate[] = [...trigITemplates, ...trigIITemplates];
