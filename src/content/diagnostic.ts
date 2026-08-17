/** Diagnóstico inicial: ubica el punto de partida del alumno por área. */

import { createRng, seedFromString } from "@/lib/rng";

export type DiagnosticArea =
  | "aritmetica"
  | "fracciones"
  | "potencias"
  | "algebra"
  | "ecuaciones"
  | "geometria"
  | "funciones";

export interface AreaInfo {
  id: DiagnosticArea;
  label: string;
  emoji: string;
  /** Conceptos del roadmap a los que siembra mastery. */
  seedConcepts: string[];
}

export const AREAS: Record<DiagnosticArea, AreaInfo> = {
  aritmetica: { id: "aritmetica", label: "Aritmética", emoji: "🔢", seedConcepts: ["enteros-signos", "orden-operaciones"] },
  fracciones: { id: "fracciones", label: "Fracciones", emoji: "➗", seedConcepts: ["fracciones-basicas"] },
  potencias: { id: "potencias", label: "Potencias y radicales", emoji: "⚡", seedConcepts: ["potencias-radicales"] },
  algebra: { id: "algebra", label: "Álgebra", emoji: "🔤", seedConcepts: ["expresiones-algebraicas", "polinomios"] },
  ecuaciones: { id: "ecuaciones", label: "Ecuaciones", emoji: "⚖️", seedConcepts: ["ecuaciones-lineales"] },
  geometria: { id: "geometria", label: "Geometría", emoji: "📐", seedConcepts: [] },
  funciones: { id: "funciones", label: "Funciones", emoji: "📈", seedConcepts: ["concepto-funcion", "funciones-lineales"] },
};

export const AREA_ORDER: DiagnosticArea[] = [
  "aritmetica",
  "fracciones",
  "potencias",
  "algebra",
  "ecuaciones",
  "geometria",
  "funciones",
];

export interface DiagnosticQuestion {
  id: string;
  area: DiagnosticArea;
  /** Enunciado en español. */
  prompt: string;
  /** Expresión matemática opcional (KaTeX display). */
  latex?: string;
  /** Opciones; si `latexOptions`, cada label se renderiza con KaTeX. */
  options: { id: string; label: string }[];
  correctId: string;
  latexOptions?: boolean;
}

const Q = (
  id: string,
  area: DiagnosticArea,
  prompt: string,
  options: string[],
  correctIndex: number,
  extra: { latex?: string; latexOptions?: boolean } = {},
): DiagnosticQuestion => {
  // Baraja determinista para que la opción correcta no sea siempre la primera.
  const rng = createRng(seedFromString("diag:" + id));
  const idx = options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const shuffled = idx.map((orig, pos) => ({ id: String(pos), label: options[orig] }));
  const correctId = String(idx.indexOf(correctIndex));
  return { id, area, prompt, latex: extra.latex, latexOptions: extra.latexOptions, options: shuffled, correctId };
};

export const DIAGNOSTIC: DiagnosticQuestion[] = [
  // Aritmética
  Q("ar1", "aritmetica", "Resolvé:", ["5", "-5", "19", "-19"], 0, { latex: "-7 + 12" }),
  Q("ar2", "aritmetica", "Resolvé:", ["12", "-12", "7", "-7"], 0, { latex: "(-3)\\times(-4)" }),
  Q("ar3", "aritmetica", "Respetando el orden de operaciones:", ["2", "10", "6", "4"], 0, { latex: "8 - 3\\times 2" }),
  Q("ar4", "aritmetica", "Resolvé:", ["-8", "8", "-6", "6"], 0, { latex: "(-2)^3" }),
  Q("ar5", "aritmetica", "Resolvé:", ["23", "17", "7", "-23"], 0, { latex: "20 - (5 - 8)" }),

  // Fracciones
  Q("fr1", "fracciones", "Sumá:", ["\\frac{3}{4}", "\\frac{2}{6}", "\\frac{1}{6}", "\\frac{2}{4}"], 0, {
    latex: "\\frac{1}{2} + \\frac{1}{4}",
    latexOptions: true,
  }),
  Q("fr2", "fracciones", "¿Cuánto es dos tercios de 30?", ["20", "15", "10", "45"], 0),
  Q("fr3", "fracciones", "Simplificá a su mínima expresión:", ["\\frac{2}{3}", "\\frac{6}{9}", "\\frac{3}{4}", "\\frac{4}{6}"], 0, {
    latex: "\\frac{12}{18}",
    latexOptions: true,
  }),
  Q("fr4", "fracciones", "Resolvé:", ["\\frac{3}{2}", "\\frac{3}{8}", "\\frac{1}{2}", "\\frac{6}{8}"], 0, {
    latex: "\\frac{3}{4} \\div \\frac{1}{2}",
    latexOptions: true,
  }),
  Q("fr5", "fracciones", "¿Cuál es mayor?", ["\\frac{2}{3}", "\\frac{3}{5}", "\\text{son iguales}", "\\text{no se puede}"], 0, {
    latex: "\\frac{2}{3} \\;?\\; \\frac{3}{5}",
    latexOptions: true,
  }),

  // Potencias y radicales
  Q("po1", "potencias", "Resolvé:", ["32", "10", "25", "16"], 0, { latex: "2^5" }),
  Q("po2", "potencias", "Resolvé:", ["12", "14", "72", "24"], 0, { latex: "\\sqrt{144}" }),
  Q("po3", "potencias", "Aplicá las propiedades:", ["x^5", "x^6", "x", "x^9"], 0, {
    latex: "x^3 \\cdot x^2",
    latexOptions: true,
  }),
  Q("po4", "potencias", "Resolvé:", ["0,01", "-100", "-20", "100"], 0, { latex: "10^{-2}" }),

  // Álgebra
  Q("al1", "algebra", "Reducí términos semejantes:", ["4x", "5x", "6x", "4"], 0, {
    latex: "3x + 2x - x",
    latexOptions: true,
  }),
  Q("al2", "algebra", "Aplicá la distributiva:", ["2x + 6", "2x + 3", "x + 6", "2x + 5"], 0, {
    latex: "2(x + 3)",
    latexOptions: true,
  }),
  Q("al3", "algebra", "Sacá el paréntesis:", ["-x + 4", "-x - 4", "x - 4", "x + 4"], 0, {
    latex: "-(x - 4)",
    latexOptions: true,
  }),
  Q("al4", "algebra", "Resolvé el producto:", ["x^2 - 4", "x^2 + 4", "x^2 - 4x", "x^2 - 2"], 0, {
    latex: "(x + 2)(x - 2)",
    latexOptions: true,
  }),

  // Ecuaciones
  Q("ec1", "ecuaciones", "Despejá x:", ["4", "10", "8", "3"], 0, { latex: "2x + 6 = 14" }),
  Q("ec2", "ecuaciones", "Despejá x:", ["15", "8", "2", "\\frac{5}{3}"], 0, {
    latex: "\\frac{x}{3} = 5",
    latexOptions: true,
  }),
  Q("ec3", "ecuaciones", "Resolvé:", ["\\pm 7", "7", "-7", "24{,}5"], 0, {
    latex: "x^2 = 49",
    latexOptions: true,
  }),
  Q("ec4", "ecuaciones", "Despejá x:", ["3", "-3", "7", "2"], 0, { latex: "5 - x = 2" }),

  // Geometría
  Q("ge1", "geometria", "¿Cuánto suman los ángulos internos de un triángulo?", ["180°", "360°", "90°", "270°"], 0),
  Q("ge2", "geometria", "Área de un rectángulo de 4 por 6:", ["24", "20", "10", "48"], 0),
  Q("ge3", "geometria", "Hipotenusa de un triángulo rectángulo de catetos 3 y 4:", ["5", "7", "12", "25"], 0),
  Q("ge4", "geometria", "Perímetro de un cuadrado de lado 5:", ["20", "25", "10", "15"], 0),

  // Funciones
  Q("fu1", "funciones", "Si f(x) = 2x + 1, ¿cuánto vale f(3)?", ["7", "6", "5", "9"], 0),
  Q("fu2", "funciones", "¿Cuál es la pendiente de la recta?", ["3", "-2", "2", "\\frac{1}{3}"], 0, {
    latex: "y = 3x - 2",
    latexOptions: true,
  }),
  Q("fu3", "funciones", "¿Cuál es el dominio de la función?", ["\\mathbb{R} - \\{0\\}", "\\mathbb{R}", "x > 0", "x \\geq 0"], 0, {
    latex: "f(x) = \\frac{1}{x}",
    latexOptions: true,
  }),
  Q("fu4", "funciones", "La gráfica de y = x² es una:", ["parábola", "recta", "circunferencia", "hipérbola"], 0),
];
