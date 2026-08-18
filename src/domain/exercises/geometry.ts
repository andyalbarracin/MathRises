import { validateChoice, validateNumeric } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

/* ======================= GEOMETRÍA I (geometria-base) ==================== */
const BASE = "geometria-base";

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [20, 21, 29],
];

export const pythagorasTemplate: ExerciseTemplate = {
  id: "PYTHAGORAS",
  conceptId: BASE,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const [a, b, c] = rng.pick(TRIPLES);
    return {
      id: `${this.id}-${index}`,
      conceptId: BASE,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Calculá la hipotenusa (teorema de Pitágoras).",
      promptLatex: "",
      promptText: `triángulo rectángulo, catetos ${a} y ${b}`,
      correctAnswerDisplay: String(c),
      diagram: { kind: "right-triangle", legA: a, legB: b, labelA: `${a}`, labelB: `${b}`, labelC: "?" },
      validate: (ans) => validateNumeric(ans, c, 0),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        "En un triángulo rectángulo, la hipotenusa al cuadrado es la suma de los cuadrados de los catetos: c² = a² + b².",
        `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}.`,
        `c = √${a * a + b * b} = ${c}.`,
      ],
      steps: [
        { latex: `c^2 = ${a}^2 + ${b}^2 = ${a * a + b * b}`, note: "Teorema de Pitágoras." },
        { latex: `c = \\sqrt{${a * a + b * b}} = ${c}`, note: "Raíz cuadrada." },
      ],
    };
  },
};

export const triangleAngleTemplate: ExerciseTemplate = {
  id: "TRIANGLE_ANGLE_SUM",
  conceptId: BASE,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const alpha = rng.int(30, 80);
    const beta = rng.int(30, 150 - alpha);
    const gamma = 180 - alpha - beta;
    return {
      id: `${this.id}-${index}`,
      conceptId: BASE,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: "Los ángulos internos suman 180°. Calculá el que falta (en grados).",
      promptLatex: "",
      promptText: `ángulos ${alpha}° y ${beta}°`,
      correctAnswerDisplay: String(gamma),
      diagram: { kind: "triangle-angles", a: `${alpha}°`, b: `${beta}°`, c: "?" },
      validate: (ans) => validateNumeric(ans, gamma, 0),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        "Los tres ángulos internos de un triángulo suman siempre 180°.",
        `Restá los dos conocidos: 180 - ${alpha} - ${beta}.`,
        `180 - ${alpha} - ${beta} = ${gamma}.`,
      ],
      steps: [
        { latex: `${alpha}° + ${beta}° + x = 180°`, note: "La suma de los ángulos es 180°." },
        { latex: `x = 180° - ${alpha}° - ${beta}° = ${gamma}°`, note: "Despejamos." },
      ],
    };
  },
};

export const rectangleTemplate: ExerciseTemplate = {
  id: "RECTANGLE_MEASURE",
  conceptId: BASE,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const w = rng.int(3, 12);
    const h = rng.int(2, 10);
    const area = rng.pick([true, false]);
    const answer = area ? w * h : 2 * (w + h);
    return {
      id: `${this.id}-${index}`,
      conceptId: BASE,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: area ? "Calculá el área del rectángulo." : "Calculá el perímetro del rectángulo.",
      promptLatex: "",
      promptText: `rectángulo ${w} × ${h}`,
      correctAnswerDisplay: String(answer),
      diagram: { kind: "rectangle", w, h, labelW: `${w}`, labelH: `${h}` },
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        area
          ? "El área de un rectángulo es base por altura."
          : "El perímetro es la suma de todos los lados: 2·(base + altura).",
        area ? `${w} × ${h}.` : `2 × (${w} + ${h}).`,
        `Es ${answer}.`,
      ],
      steps: [
        area
          ? { latex: `A = ${w} \\times ${h} = ${answer}`, note: "Base por altura." }
          : { latex: `P = 2\\cdot(${w} + ${h}) = ${answer}`, note: "Suma de los lados." },
      ],
    };
  },
};

export const geometriaBaseTemplates: ExerciseTemplate[] = [
  pythagorasTemplate,
  triangleAngleTemplate,
  rectangleTemplate,
];

/* ==================== GEOMETRÍA II (geometria-plana) ==================== */
const PLANA = "geometria-plana";

export const circleTemplate: ExerciseTemplate = {
  id: "CIRCLE_MEASURE",
  conceptId: PLANA,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const r = rng.int(2, 9);
    const area = rng.pick([true, false]);
    const k = area ? r * r : 2 * r;
    const wrongs = area
      ? [`${2 * r}\\pi`, `${r}\\pi`, `${r * r * r}\\pi`]
      : [`${r * r}\\pi`, `${r}\\pi`, `${4 * r}\\pi`];
    const { options, correctId, correctLatex } = buildChoices(rng, [
      { latex: `${k}\\pi`, correct: true },
      { latex: wrongs[0], correct: false },
      { latex: wrongs[1], correct: false },
      { latex: wrongs[2], correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: PLANA,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: area
        ? "Calculá el área del círculo (en términos de π)."
        : "Calculá el perímetro del círculo (en términos de π).",
      promptLatex: "",
      promptText: `círculo de radio ${r}`,
      correctAnswerDisplay: correctLatex,
      diagram: { kind: "circle", labelR: `r = ${r}` },
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        area ? "El área del círculo es π·r²." : "El perímetro (circunferencia) es 2·π·r.",
        area ? `r² = ${r}² = ${r * r}.` : `2·r = 2·${r} = ${2 * r}.`,
        `Queda ${k}π.`,
      ],
      steps: [
        area
          ? { latex: `A = \\pi r^2 = \\pi \\cdot ${r}^2 = ${r * r}\\pi`, note: "Área del círculo." }
          : { latex: `P = 2\\pi r = 2\\pi \\cdot ${r} = ${2 * r}\\pi`, note: "Circunferencia." },
      ],
    };
  },
};

function nonZero(rng: Rng): number {
  let v = 0;
  while (v === 0) v = rng.int(-4, 4);
  return v;
}

export const coordPointTemplate: ExerciseTemplate = {
  id: "COORD_POINT",
  conceptId: PLANA,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const x = nonZero(rng);
    let y = nonZero(rng);
    while (y === x) y = nonZero(rng);
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: `(${x}; ${y})`, correct: true },
      { text: `(${y}; ${x})`, correct: false },
      { text: `(${-x}; ${y})`, correct: false },
      { text: `(${x}; ${-y})`, correct: false },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: PLANA,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "easy",
      instruction: "¿Cuáles son las coordenadas del punto P?",
      promptLatex: "",
      promptText: `punto en (${x}; ${y})`,
      correctAnswerDisplay: correctText,
      diagram: { kind: "coord-point", x, y, label: "P" },
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        "Las coordenadas se escriben (x; y): primero cuánto te movés en horizontal, después en vertical.",
        "Contá desde el origen: a la derecha es x positivo, hacia arriba es y positivo.",
        `El punto es (${x}; ${y}).`,
      ],
      steps: [{ latex: `P = (${x};\\ ${y})`, note: "Primero x (horizontal), luego y (vertical)." }],
    };
  },
};

export const quadrantTemplate: ExerciseTemplate = {
  id: "COORD_QUADRANT",
  conceptId: PLANA,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const x = nonZero(rng);
    const y = nonZero(rng);
    const q = x > 0 && y > 0 ? "I" : x < 0 && y > 0 ? "II" : x < 0 && y < 0 ? "III" : "IV";
    const { options, correctId, correctText } = buildChoices(rng, [
      { text: "I", correct: q === "I" },
      { text: "II", correct: q === "II" },
      { text: "III", correct: q === "III" },
      { text: "IV", correct: q === "IV" },
    ]);
    return {
      id: `${this.id}-${index}`,
      conceptId: PLANA,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "¿En qué cuadrante está el punto?",
      promptLatex: "",
      promptText: `punto en (${x}; ${y})`,
      correctAnswerDisplay: correctText,
      diagram: { kind: "coord-point", x, y, label: "P" },
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        "Los cuadrantes se numeran en sentido antihorario: I (arriba-derecha), II (arriba-izquierda), III (abajo-izquierda), IV (abajo-derecha).",
        `El punto tiene x ${x > 0 ? "positivo" : "negativo"} e y ${y > 0 ? "positivo" : "negativo"}.`,
        `Está en el cuadrante ${q}.`,
      ],
      steps: [{ latex: `(${x};\\ ${y}) \\to \\text{cuadrante } ${q}`, note: "Según los signos de x e y." }],
    };
  },
};

export const geometriaPlanaTemplates: ExerciseTemplate[] = [
  circleTemplate,
  coordPointTemplate,
  quadrantTemplate,
];

/* ============= GEOMETRÍA II (semejanza-transformaciones) ================ */
const SEM = "semejanza-transformaciones";

export const similarSideTemplate: ExerciseTemplate = {
  id: "SIMILAR_SIDE",
  conceptId: SEM,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const k = rng.int(2, 4);
    const answer = k * b;
    return {
      id: `${this.id}-${index}`,
      conceptId: SEM,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "Los triángulos son semejantes. Calculá el lado que falta (el marcado con ?).",
      promptLatex: "",
      promptText: `semejanza: chico ${a},${b}; grande ${k * a},?`,
      correctAnswerDisplay: String(answer),
      diagram: {
        kind: "similar-triangles",
        small: [`${a}`, `${b}`],
        large: [`${k * a}`, "?"],
      },
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        "En triángulos semejantes, los lados correspondientes están en la misma proporción (razón de semejanza).",
        `La razón es ${k * a} ÷ ${a} = ${k}. Multiplicá el otro lado por ${k}.`,
        `${b} × ${k} = ${answer}.`,
      ],
      steps: [
        { latex: `k = \\dfrac{${k * a}}{${a}} = ${k}`, note: "Razón de semejanza." },
        { latex: `? = ${b} \\times ${k} = ${answer}`, note: "Aplicamos la razón al otro lado." },
      ],
    };
  },
};

export const scaleLengthTemplate: ExerciseTemplate = {
  id: "SCALE_LENGTH",
  conceptId: SEM,
  cardType: "NUMERIC_INPUT",
  difficulty: "easy",
  generate(rng: Rng, index: number): GeneratedExercise {
    const k = rng.pick([50, 100, 200, 25]);
    const d = rng.int(2, 9);
    const answer = d * k;
    return {
      id: `${this.id}-${index}`,
      conceptId: SEM,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "easy",
      instruction: `En un plano a escala 1:${k}, una pared mide ${d} cm. ¿Cuánto mide en la realidad (en cm)?`,
      promptLatex: `\\text{escala } 1 : ${k}`,
      promptText: `escala 1:${k}, plano ${d} cm`,
      correctAnswerDisplay: String(answer),
      validate: (ans) => validateNumeric(ans, answer, 0),
      classifyError: (): ErrorCategory[] => ["UNIT_CONVERSION"],
      hints: [
        "En una escala 1:k, cada unidad del plano equivale a k unidades reales.",
        `Multiplicá la medida del plano por ${k}.`,
        `${d} × ${k} = ${answer}.`,
      ],
      steps: [
        { latex: `${d} \\text{ cm} \\times ${k} = ${answer} \\text{ cm}`, note: "Escala 1:k ⇒ multiplicar por k." },
      ],
    };
  },
};

export const scaleFactorTemplate: ExerciseTemplate = {
  id: "SCALE_FACTOR",
  conceptId: SEM,
  cardType: "NUMERIC_INPUT",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const k = rng.int(2, 5);
    return {
      id: `${this.id}-${index}`,
      conceptId: SEM,
      templateId: this.id,
      cardType: "NUMERIC_INPUT",
      difficulty: "medium",
      instruction: "¿Cuál es la razón de semejanza (grande ÷ chico)?",
      promptLatex: "",
      promptText: `chico ${a},${b}; grande ${k * a},${k * b}`,
      correctAnswerDisplay: String(k),
      diagram: {
        kind: "similar-triangles",
        small: [`${a}`, `${b}`],
        large: [`${k * a}`, `${k * b}`],
      },
      validate: (ans) => validateNumeric(ans, k, 0),
      classifyError: (): ErrorCategory[] => ["GEOMETRY_DIAGRAM"],
      hints: [
        "La razón de semejanza es cuántas veces más grande es un triángulo respecto del otro.",
        `Dividí un lado del grande por el lado correspondiente del chico: ${k * a} ÷ ${a}.`,
        `La razón es ${k}.`,
      ],
      steps: [{ latex: `k = \\dfrac{${k * a}}{${a}} = ${k}`, note: "Lado grande sobre lado chico." }],
    };
  },
};

export const semejanzaTemplates: ExerciseTemplate[] = [
  similarSideTemplate,
  scaleLengthTemplate,
  scaleFactorTemplate,
];

export const geometryTemplates: ExerciseTemplate[] = [
  ...geometriaBaseTemplates,
  ...geometriaPlanaTemplates,
  ...semejanzaTemplates,
];
