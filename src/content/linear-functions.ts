import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const FUNC_LINEAL_CONCEPT_ID = "funciones-lineales";

export const funcLinealConcept: Concept = {
  id: FUNC_LINEAL_CONCEPT_ID,
  slug: "funcion-lineal-y-rectas",
  title: "Función lineal y rectas",
  description: "Pendiente, rectas, paralelas y perpendiculares.",
  module: "FUNCIONES",
  prerequisites: ["concepto-funcion"],
  difficulty: "medium",
  targetWeek: 13,
  masteryRequired: 4,
  tags: ["funciones", "recta", "pendiente"],
};

export const funcLinealLesson: LessonContent = {
  explanation: {
    title: "La pendiente manda",
    mentor: "delta",
    body: [
      "Una función lineal se escribe y = mx + b. La pendiente m indica la inclinación de la recta, y b es la ordenada al origen (dónde corta al eje y).",
      "La pendiente entre dos puntos es la variación de y sobre la variación de x: m = (y₂ - y₁) / (x₂ - x₁).",
      "Dos rectas son paralelas si tienen la misma pendiente, y perpendiculares si el producto de sus pendientes es -1 (por ejemplo, 2 y -1/2).",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "A(1;\\, 2), \\quad B(4;\\, 8)",
    steps: [
      { latex: "m = \\dfrac{8 - 2}{4 - 1} = \\dfrac{6}{3}", note: "Variación de y sobre variación de x." },
      { latex: "= 2", note: "La pendiente es 2." },
    ],
  },
};
