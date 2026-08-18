import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

/* ---- Geometría base (S11) ---- */
export const GEO_BASE_CONCEPT_ID = "geometria-base";

export const geoBaseConcept: Concept = {
  id: GEO_BASE_CONCEPT_ID,
  slug: "geometria-base",
  title: "Geometría base",
  description: "Ángulos de triángulos, Pitágoras, perímetro y área.",
  module: "GEOMETRIA_I",
  prerequisites: ["potencias-radicales"],
  difficulty: "medium",
  targetWeek: 11,
  masteryRequired: 4,
  tags: ["geometria", "triangulos", "pitagoras"],
};

export const geoBaseLesson: LessonContent = {
  explanation: {
    title: "Ángulos, lados y el teorema estrella",
    mentor: "delta",
    body: [
      "Los tres ángulos internos de cualquier triángulo suman 180°. Si conocés dos, el tercero sale restando.",
      "En un triángulo rectángulo vale el teorema de Pitágoras: la hipotenusa al cuadrado es la suma de los cuadrados de los catetos (c² = a² + b²).",
      "El área de un rectángulo es base por altura, y su perímetro es la suma de todos sus lados: 2·(base + altura).",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "a = 3, \\quad b = 4",
    steps: [
      { latex: "c^2 = 3^2 + 4^2 = 9 + 16 = 25", note: "Teorema de Pitágoras." },
      { latex: "c = \\sqrt{25} = 5", note: "La hipotenusa mide 5." },
    ],
  },
};

/* ---- Geometría plana (S16) ---- */
export const GEO_PLANA_CONCEPT_ID = "geometria-plana";

export const geoPlanaConcept: Concept = {
  id: GEO_PLANA_CONCEPT_ID,
  slug: "geometria-plana-avanzada",
  title: "Geometría plana avanzada",
  description: "Círculo, plano cartesiano y cuadrantes.",
  module: "GEOMETRIA_II",
  prerequisites: ["geometria-base"],
  difficulty: "medium",
  targetWeek: 16,
  masteryRequired: 4,
  tags: ["geometria", "circulo", "coordenadas"],
};

export const geoPlanaLesson: LessonContent = {
  explanation: {
    title: "El círculo y el plano cartesiano",
    mentor: "delta",
    body: [
      "En un círculo de radio r, el área es π·r² y el perímetro (circunferencia) es 2·π·r. Se suelen dejar expresados 'en términos de π'.",
      "El plano cartesiano ubica puntos con un par (x; y): primero cuánto te movés en horizontal, después en vertical.",
      "Los ejes dividen el plano en cuatro cuadrantes, numerados en sentido antihorario desde arriba-derecha (I, II, III, IV) según los signos de x e y.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "r = 3",
    steps: [
      { latex: "A = \\pi r^2 = \\pi \\cdot 3^2 = 9\\pi", note: "Área del círculo." },
      { latex: "P = 2\\pi r = 6\\pi", note: "Circunferencia." },
    ],
  },
};

/* ---- Semejanza y transformaciones (S17) ---- */
export const GEO_SEM_CONCEPT_ID = "semejanza-transformaciones";

export const geoSemConcept: Concept = {
  id: GEO_SEM_CONCEPT_ID,
  slug: "semejanza-y-transformaciones",
  title: "Semejanza y escalas",
  description: "Razón de semejanza, lados proporcionales y escalas.",
  module: "GEOMETRIA_II",
  prerequisites: ["geometria-base"],
  difficulty: "medium",
  targetWeek: 17,
  masteryRequired: 4,
  tags: ["geometria", "semejanza", "escala"],
};

export const geoSemLesson: LessonContent = {
  explanation: {
    title: "La misma forma, distinto tamaño",
    mentor: "delta",
    body: [
      "Dos figuras son semejantes si tienen la misma forma pero distinto tamaño. Sus lados correspondientes están en la misma proporción, llamada razón de semejanza.",
      "Si conocés la razón, multiplicás un lado del chico por ella para obtener el lado del grande (o dividís para el camino inverso).",
      "Las escalas funcionan igual: en un plano a escala 1:100, cada centímetro representa 100 cm reales, así que multiplicás por 100.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\text{chico: } 3, 4 \\quad \\text{grande: } 6, \\;?",
    steps: [
      { latex: "k = \\dfrac{6}{3} = 2", note: "Razón de semejanza." },
      { latex: "? = 4 \\times 2 = 8", note: "Aplicamos la razón al otro lado." },
    ],
  },
};
