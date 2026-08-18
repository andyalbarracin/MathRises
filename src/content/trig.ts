import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

/* ---- Trigonometría I (S18) ---- */
export const TRIG1_CONCEPT_ID = "trig-i";

export const trig1Concept: Concept = {
  id: TRIG1_CONCEPT_ID,
  slug: "trigonometria-i",
  title: "Trigonometría I",
  description: "Seno, coseno y tangente en el triángulo rectángulo.",
  module: "TRIGONOMETRIA",
  prerequisites: ["geometria-base"],
  difficulty: "hard",
  targetWeek: 18,
  masteryRequired: 4,
  tags: ["trigonometria", "seno", "coseno", "tangente"],
};

export const trig1Lesson: LessonContent = {
  explanation: {
    title: "SOH-CAH-TOA",
    mentor: "delta",
    body: [
      "En un triángulo rectángulo, las razones trigonométricas relacionan un ángulo con sus lados. Respecto de un ángulo θ, el cateto opuesto es el que no lo toca y el adyacente es el que sí.",
      "Seno = opuesto / hipotenusa. Coseno = adyacente / hipotenusa. Tangente = opuesto / adyacente. La regla 'SOH-CAH-TOA' ayuda a recordarlas.",
      "Los ángulos notables tienen valores exactos que conviene memorizar: sen(30°) = 1/2, cos(60°) = 1/2, sen(45°) = cos(45°) = √2/2, tan(45°) = 1.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\text{catetos } 3 \\text{ y } 4, \\text{ hipotenusa } 5",
    steps: [
      { latex: "\\text{sen}(θ) = \\dfrac{\\text{opuesto}}{\\text{hipotenusa}} = \\dfrac{3}{5}", note: "Si el opuesto a θ es 3." },
      { latex: "\\cos(θ) = \\dfrac{4}{5}, \\quad \\tan(θ) = \\dfrac{3}{4}", note: "Las otras dos razones." },
    ],
  },
};

/* ---- Trigonometría II (S19) ---- */
export const TRIG2_CONCEPT_ID = "trig-ii";

export const trig2Concept: Concept = {
  id: TRIG2_CONCEPT_ID,
  slug: "trigonometria-ii",
  title: "Trigonometría II",
  description: "Grados y radianes, teorema del seno y del coseno.",
  module: "TRIGONOMETRIA",
  prerequisites: ["trig-i"],
  difficulty: "hard",
  targetWeek: 19,
  masteryRequired: 4,
  tags: ["trigonometria", "radianes", "senos", "cosenos"],
};

export const trig2Lesson: LessonContent = {
  explanation: {
    title: "Radianes y triángulos cualesquiera",
    mentor: "delta",
    body: [
      "Además de grados, los ángulos se miden en radianes. La equivalencia base es 180° = π radianes. Para pasar de grados a radianes se multiplica por π/180; para el camino inverso, por 180/π.",
      "El teorema del seno relaciona cada lado con el seno de su ángulo opuesto. Se usa cuando conocés un lado con su ángulo opuesto (y otro ángulo o lado).",
      "El teorema del coseno generaliza a Pitágoras: sirve cuando conocés dos lados y el ángulo entre ellos, o los tres lados.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "60°",
    steps: [
      { latex: "60° \\times \\dfrac{\\pi}{180} = \\dfrac{\\pi}{3}", note: "Grados a radianes: ×π/180 y simplificamos." },
      { latex: "\\dfrac{\\pi}{2} \\times \\dfrac{180}{\\pi} = 90°", note: "Radianes a grados: ×180/π." },
    ],
  },
};
