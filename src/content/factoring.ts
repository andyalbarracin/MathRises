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
    simple: [
      "Factorizar es como pasar de '2 × 3 = 6' pero al revés: te dan el 6 y buscás el 2 × 3. O sea, escribir la expresión como una multiplicación.",
      "Antes de calcular, mirá el molde: ¿hay algo que se repite en todos los términos (factor común)? ¿Es una resta de dos cuadrados? Reconocer el patrón es la mitad del trabajo.",
    ],
    recall: {
      conceptId: "polinomios",
      title: "¿Te acordás de los productos notables?",
      text: "Factorizar es deshacer un producto notable: si (x + 3)² = x² + 6x + 9, entonces x² + 6x + 9 se factoriza como (x + 3)².",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "x^2 - 9",
    steps: [
      {
        latex: "x^2 - 9 = x^2 - 3^2",
        note: "Es una diferencia de cuadrados (√9 = 3).",
        plain: "9 es 3², así que esto es una resta de dos cuadrados: x² − 3².",
      },
      {
        latex: "= (x + 3)(x - 3)",
        note: "Aplicamos la fórmula.",
        plain: "La fórmula de diferencia de cuadrados: a² − b² = (a + b)(a − b), con a = x y b = 3.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "factorizar", plain: "Escribir una expresión como una multiplicación de factores. Es el camino inverso a distribuir. 6x + 9 = 3(2x + 3)." },
    { term: "factor común", plain: "Un número o letra que está en todos los términos y se puede 'sacar afuera'. En 6x + 9, el factor común es 3." },
    { term: "diferencia de dos cuadrados", plain: "Una resta de dos cosas que son cuadrados: a² − b². Se factoriza como (a + b)(a − b)." },
    { term: "trinomio", plain: "Un polinomio de tres términos, como x² + 6x + 9." },
    { term: "cuadrado perfecto", plain: "Un trinomio que es el cuadrado de un binomio, como x² + 6x + 9 = (x + 3)²." },
  ],
};
