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
    simple: [
      "En un triángulo rectángulo, seno, coseno y tangente son solo divisiones entre dos lados. 'SOH-CAH-TOA' te dice cuáles: Seno=Opuesto/Hipotenusa, Coseno=Adyacente/Hipotenusa, Tangente=Opuesto/Adyacente.",
      "Respecto de un ángulo: el lado de enfrente es el opuesto, el de al lado es el adyacente, y el más largo siempre es la hipotenusa.",
    ],
    recall: {
      conceptId: "geometria-base",
      title: "¿Te acordás del triángulo rectángulo?",
      text: "La trigonometría vive en el triángulo rectángulo de Pitágoras: los catetos y la hipotenusa que ya conocés.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\text{catetos } 3 \\text{ y } 4, \\text{ hipotenusa } 5",
    steps: [
      {
        latex: "\\text{sen}(θ) = \\dfrac{\\text{opuesto}}{\\text{hipotenusa}} = \\dfrac{3}{5}",
        note: "Si el opuesto a θ es 3.",
        plain: "El seno es el lado de enfrente al ángulo (3) dividido la hipotenusa (5).",
      },
      {
        latex: "\\cos(θ) = \\dfrac{4}{5}, \\quad \\tan(θ) = \\dfrac{3}{4}",
        note: "Las otras dos razones.",
        plain: "Coseno = adyacente/hipotenusa (4/5). Tangente = opuesto/adyacente (3/4).",
      },
    ],
  },
  materials: ["calculadora científica", "transportador", "regla"],
  glossary: [
    { term: "razones trigonométricas", plain: "Las cuentas (seno, coseno, tangente) que relacionan un ángulo con los lados de un triángulo rectángulo." },
    { term: "cateto opuesto", plain: "El cateto que NO toca al ángulo que mirás (está 'enfrente')." },
    { term: "adyacente", plain: "El cateto que SÍ toca al ángulo que mirás (está al lado)." },
    { term: "hipotenusa", plain: "El lado más largo del triángulo rectángulo, enfrente del ángulo de 90°." },
    { term: "ángulos notables", plain: "Ángulos (30°, 45°, 60°) cuyos senos y cosenos tienen valores exactos que conviene saber de memoria." },
  ],
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
    simple: [
      "Los radianes son otra 'unidad' para los ángulos, como pasar de metros a pies. La regla base: 180° = π radianes. Para pasar de grados a radianes, multiplicás por π/180.",
      "Los teoremas del seno y del coseno sirven para triángulos que NO tienen ángulo recto, donde Pitágoras solo no alcanza.",
    ],
    recall: {
      conceptId: "trig-i",
      title: "¿Te acordás del seno y el coseno?",
      text: "Estos teoremas usan el seno y el coseno que viste en Trigonometría I, ahora en triángulos cualesquiera.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "60°",
    steps: [
      {
        latex: "60° \\times \\dfrac{\\pi}{180} = \\dfrac{\\pi}{3}",
        note: "Grados a radianes: ×π/180 y simplificamos.",
        plain: "Para pasar 60° a radianes, multiplicamos por π/180 y simplificamos: 60/180 = 1/3, queda π/3.",
      },
      {
        latex: "\\dfrac{\\pi}{2} \\times \\dfrac{180}{\\pi} = 90°",
        note: "Radianes a grados: ×180/π.",
        plain: "Para volver a grados, multiplicamos por 180/π. π/2 da 90°.",
      },
    ],
  },
  materials: ["calculadora científica", "transportador"],
  glossary: [
    { term: "radianes", plain: "Otra forma de medir ángulos (en vez de grados). Media vuelta (180°) es π radianes." },
    { term: "teorema del seno", plain: "Relaciona cada lado con el seno de su ángulo opuesto. Sirve cuando conocés un lado y su ángulo de enfrente." },
    { term: "teorema del coseno", plain: "Una versión de Pitágoras para triángulos cualesquiera. Sirve con dos lados y el ángulo entre ellos, o con los tres lados." },
  ],
};
