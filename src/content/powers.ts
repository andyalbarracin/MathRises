import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const POTENCIAS_CONCEPT_ID = "potencias-radicales";

export const potenciasConcept: Concept = {
  id: POTENCIAS_CONCEPT_ID,
  slug: "potencias-y-radicales",
  title: "Potencias y radicales",
  description: "Potencias, raíces cuadradas y propiedades básicas.",
  module: "FUNDAMENTOS",
  prerequisites: ["enteros-signos"],
  difficulty: "easy",
  targetWeek: 2,
  masteryRequired: 4,
  tags: ["potencias", "radicales", "fundamentos"],
};

export const potenciasLesson: LessonContent = {
  explanation: {
    title: "Potencias: multiplicar, no sumar",
    mentor: "vector",
    body: [
      "Una potencia b^n significa multiplicar la base b por sí misma n veces. Por ejemplo, 2^3 = 2 × 2 × 2 = 8. Ojo: no es 2 × 3.",
      "La raíz cuadrada es la operación inversa: √9 = 3 porque 3 × 3 = 9. Cuando el número es un cuadrado perfecto, la raíz es exacta.",
      "Propiedad clave: al multiplicar potencias de la misma base, los exponentes se suman: x^2 · x^3 = x^5.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "3^2 + \\sqrt{16}",
    steps: [
      { latex: "3^2 = 3 \\times 3 = 9", note: "Primero la potencia." },
      { latex: "\\sqrt{16} = 4", note: "Raíz de un cuadrado perfecto." },
      { latex: "9 + 4 = 13", note: "Sumamos." },
    ],
  },
};
