import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const SISTEMAS_CONCEPT_ID = "sistemas-ecuaciones";

export const sistemasConcept: Concept = {
  id: SISTEMAS_CONCEPT_ID,
  slug: "sistemas-de-ecuaciones",
  title: "Sistemas de ecuaciones",
  description: "Resolver sistemas 2×2 por sustitución o eliminación.",
  module: "FUNCIONES",
  prerequisites: ["ecuaciones-lineales"],
  difficulty: "hard",
  targetWeek: 14,
  masteryRequired: 4,
  tags: ["funciones", "sistemas"],
};

export const sistemasLesson: LessonContent = {
  explanation: {
    title: "Dos ecuaciones, dos incógnitas",
    mentor: "vector",
    body: [
      "Un sistema 2×2 tiene dos ecuaciones con dos incógnitas (x e y). Resolverlo es encontrar el par (x, y) que cumple ambas a la vez.",
      "Por sustitución: despejás una variable en una ecuación y la reemplazás en la otra, para quedarte con una sola incógnita.",
      "Por eliminación: sumás o restás las ecuaciones (multiplicándolas si hace falta) para cancelar una variable. Gráficamente, la solución es el punto donde se cruzan las dos rectas.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}",
    steps: [
      { latex: "2x = 6", note: "Sumamos las dos ecuaciones (se cancela y)." },
      { latex: "x = 3, \\quad y = 2", note: "Despejamos x y luego y." },
    ],
  },
};
