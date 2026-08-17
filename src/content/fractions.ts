import type { Concept } from "@/domain/types";

export const FRACCIONES_CONCEPT_ID = "fracciones-basicas";

export const fraccionesConcept: Concept = {
  id: FRACCIONES_CONCEPT_ID,
  slug: "fracciones-equivalencia-operaciones",
  title: "Fracciones: equivalencia y operaciones básicas",
  description:
    "Simplificar, reconocer fracciones equivalentes y sumar con distinto denominador.",
  module: "FUNDAMENTOS",
  prerequisites: [],
  difficulty: "easy",
  targetWeek: 1,
  masteryRequired: 4,
  tags: ["fracciones", "aritmética", "fundamentos"],
};

/** Contenido de la mini-lección (cards de explicación previas a los ejercicios). */
export interface LessonContent {
  explanation: {
    title: string;
    body: string[];
    mentor: string; // slug del mentor
  };
  workedExample: {
    title: string;
    problemLatex: string;
    steps: { latex: string; note: string }[];
  };
}

export const fraccionesLesson: LessonContent = {
  explanation: {
    title: "Un denominador común, no dos denominadores sumados",
    mentor: "sigma",
    body: [
      "Una fracción representa una parte de un todo: en 3/4, el 4 dice en cuántas partes iguales dividimos y el 3 cuántas tomamos.",
      "Dos fracciones son equivalentes si se obtienen multiplicando (o dividiendo) numerador y denominador por el mismo número: 1/2 = 2/4 = 3/6.",
      "Para sumar o restar fracciones con distinto denominador, primero hay que llevarlas a un denominador común. El error más frecuente es sumar los denominadores: eso está mal.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\dfrac{1}{2} + \\dfrac{1}{3}",
    steps: [
      { latex: "\\text{m.c.m.}(2, 3) = 6", note: "Buscamos un denominador común." },
      {
        latex: "\\dfrac{1}{2} + \\dfrac{1}{3} = \\dfrac{3}{6} + \\dfrac{2}{6}",
        note: "Convertimos ambas al denominador 6.",
      },
      { latex: "= \\dfrac{5}{6}", note: "Sumamos los numeradores. Ya está en mínima expresión." },
    ],
  },
};
