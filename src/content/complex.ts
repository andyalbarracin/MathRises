import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const COMPLEJOS_CONCEPT_ID = "complejos";

export const complejosConcept: Concept = {
  id: COMPLEJOS_CONCEPT_ID,
  slug: "numeros-complejos",
  title: "Números complejos",
  description: "Suma, potencias de i y conjugado.",
  module: "COMPLEJOS",
  prerequisites: ["potencias-radicales"],
  difficulty: "hard",
  targetWeek: 21,
  masteryRequired: 4,
  tags: ["complejos", "imaginarios"],
};

export const complejosLesson: LessonContent = {
  explanation: {
    title: "La unidad imaginaria i",
    mentor: "vector",
    body: [
      "Un número complejo se escribe a + bi, donde a es la parte real y b la parte imaginaria. La unidad imaginaria cumple i² = -1.",
      "Para sumar complejos se suma parte real con real y parte imaginaria con imaginaria, por separado.",
      "Las potencias de i se repiten cada 4: i = i, i² = -1, i³ = -i, i⁴ = 1. Y el conjugado de a + bi es a - bi (mismo real, se invierte el signo de la parte imaginaria).",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "(2 + 3i) + (1 - 5i)",
    steps: [
      { latex: "(2 + 1) + (3 - 5)i", note: "Sumamos real con real e imaginaria con imaginaria." },
      { latex: "= 3 - 2i", note: "Resultado." },
    ],
  },
};
