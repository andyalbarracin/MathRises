import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const FACTOR1_CONCEPT_ID = "factorizacion-1";

export const factor1Concept: Concept = {
  id: FACTOR1_CONCEPT_ID,
  slug: "factorizacion-i",
  title: "Factorización I",
  description: "Factor común, diferencia de cuadrados y reconocer el método.",
  module: "ALGEBRA",
  prerequisites: ["polinomios"],
  difficulty: "medium",
  targetWeek: 5,
  masteryRequired: 4,
  tags: ["algebra", "factorizacion"],
};

export const factor1Lesson: LessonContent = {
  explanation: {
    title: "Reconocer el patrón antes de calcular",
    mentor: "sigma",
    body: [
      "Factorizar es escribir una expresión como producto. El primer paso es siempre buscar factor común: 6x + 9 = 3(2x + 3).",
      "Si ves una resta de dos cuadrados, usá la fórmula a² - b² = (a + b)(a - b). Por ejemplo, x² - 25 = (x + 5)(x - 5).",
      "Si es un trinomio de la forma x² + 2ax + a², es un cuadrado perfecto: (x + a)². Aprender a reconocer el método es más importante que calcular rápido.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "x^2 - 9",
    steps: [
      { latex: "x^2 - 9 = x^2 - 3^2", note: "Es una diferencia de cuadrados (√9 = 3)." },
      { latex: "= (x + 3)(x - 3)", note: "Aplicamos la fórmula." },
    ],
  },
};
