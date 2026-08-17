import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const ORDEN_CONCEPT_ID = "orden-operaciones";

export const ordenConcept: Concept = {
  id: ORDEN_CONCEPT_ID,
  slug: "orden-de-operaciones",
  title: "Orden de operaciones",
  description: "Qué se resuelve primero: paréntesis, multiplicación y división, suma y resta.",
  module: "FUNDAMENTOS",
  prerequisites: ["enteros-signos"],
  difficulty: "easy",
  targetWeek: 1,
  masteryRequired: 4,
  tags: ["orden", "operaciones", "fundamentos"],
};

export const ordenLesson: LessonContent = {
  explanation: {
    title: "No se resuelve de izquierda a derecha",
    mentor: "vector",
    body: [
      "Cuando hay varias operaciones, hay un orden: primero lo que está entre paréntesis, después potencias y raíces, luego multiplicaciones y divisiones, y al final sumas y restas.",
      "Por eso 2 + 3 × 4 no es 20: primero 3 × 4 = 12, y después 2 + 12 = 14.",
      "Los paréntesis cambian la prioridad: (2 + 3) × 4 sí es 20, porque el paréntesis va primero.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "(6 + 2) \\times 3 - 5",
    steps: [
      { latex: "(6 + 2) \\times 3 - 5 = 8 \\times 3 - 5", note: "Primero el paréntesis." },
      { latex: "= 24 - 5", note: "Después la multiplicación." },
      { latex: "= 19", note: "Por último, la resta." },
    ],
  },
};
