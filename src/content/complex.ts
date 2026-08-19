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
    simple: [
      "Los complejos aparecen cuando necesitamos la 'raíz de un negativo'. Se inventa i, que cumple i² = −1. Un complejo tiene dos partes: una normal y otra con i.",
      "Para sumarlos, juntás por separado: las partes reales entre sí y las que tienen i entre sí. Como sumar pesos con pesos y centavos con centavos.",
    ],
    recall: {
      conceptId: "potencias-radicales",
      title: "¿Te acordás de las raíces?",
      text: "Los complejos nacen de querer una raíz cuadrada de un número negativo, algo imposible con los reales que viste en potencias y radicales.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "(2 + 3i) + (1 - 5i)",
    steps: [
      {
        latex: "(2 + 1) + (3 - 5)i",
        note: "Sumamos real con real e imaginaria con imaginaria.",
        plain: "Juntamos las partes reales (2 + 1) y, aparte, las imaginarias (3 − 5).",
      },
      {
        latex: "= 3 - 2i",
        note: "Resultado.",
        plain: "2 + 1 = 3 (real) y 3 − 5 = −2 (imaginaria): queda 3 − 2i.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "número complejo", plain: "Un número de la forma a + bi, con una parte 'normal' (real) y una parte con i (imaginaria)." },
    { term: "parte real", plain: "La parte sin i. En 2 + 3i, la parte real es 2." },
    { term: "parte imaginaria", plain: "La parte que acompaña a la i. En 2 + 3i, la parte imaginaria es 3." },
    { term: "unidad imaginaria", plain: "El número i, definido para que i² = −1 (algo que ningún número normal cumple)." },
    { term: "conjugado", plain: "El mismo complejo con el signo de la parte imaginaria cambiado. El conjugado de a + bi es a − bi." },
  ],
};
