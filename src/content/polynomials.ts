import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const POLINOMIOS_CONCEPT_ID = "polinomios";

export const polinomiosConcept: Concept = {
  id: POLINOMIOS_CONCEPT_ID,
  slug: "operaciones-con-polinomios",
  title: "Operaciones con polinomios",
  description: "Sumar polinomios, multiplicar monomios y productos notables.",
  module: "ALGEBRA",
  prerequisites: ["expresiones-algebraicas"],
  difficulty: "medium",
  targetWeek: 4,
  masteryRequired: 4,
  tags: ["algebra", "polinomios"],
};

export const polinomiosLesson: LessonContent = {
  explanation: {
    title: "Sumar semejantes, multiplicar exponentes",
    mentor: "vector",
    body: [
      "Para sumar polinomios se agrupan y suman los términos semejantes: (3x + 2) + (x - 5) = 4x - 3.",
      "Al multiplicar monomios, se multiplican los coeficientes y se suman los exponentes de la misma base: 2x · 3x = 6x².",
      "Producto notable del cuadrado de un binomio: (x + a)² = x² + 2·a·x + a². El error típico es olvidar el término del medio (2ax).",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "(x + 3)^2",
    steps: [
      { latex: "(x + 3)^2 = x^2 + 2\\cdot 3\\cdot x + 3^2", note: "Cuadrado, doble producto, cuadrado." },
      { latex: "= x^2 + 6x + 9", note: "Operamos." },
    ],
  },
};
