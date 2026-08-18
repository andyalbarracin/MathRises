import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const ENTEROS_CONCEPT_ID = "enteros-signos";

export const enterosConcept: Concept = {
  id: ENTEROS_CONCEPT_ID,
  slug: "enteros-signos-recta",
  title: "Enteros y signos",
  description: "Sumar, restar y multiplicar con números positivos y negativos.",
  module: "FUNDAMENTOS",
  prerequisites: [],
  difficulty: "easy",
  targetWeek: 1,
  masteryRequired: 4,
  tags: ["enteros", "signos", "fundamentos"],
};

export const enterosLesson: LessonContent = {
  explanation: {
    title: "Los signos marcan la dirección",
    mentor: "vector",
    body: [
      "Los números enteros incluyen los positivos, el cero y los negativos. En una recta numérica, los negativos están a la izquierda del 0 y los positivos a la derecha.",
      "Sumar un negativo es lo mismo que restar: 5 + (−3) = 5 − 3 = 2. Restar un negativo es sumar: 5 − (−3) = 5 + 3 = 8.",
      "Para multiplicar, la regla de signos: signos iguales dan positivo, signos distintos dan negativo. (−)(−) = +, (−)(+) = −.",
    ],
    simple: [
      "Pensá en la plata. Los números positivos son la plata que tenés; los negativos, lo que debés. Si tenés 5 y debés 3 (5 + (−3)), te quedan 2.",
      "Restar una deuda es como que te la perdonen: 5 − (−3) es como sumar 3, y te quedan 8.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "-4 + (7) + (-2)",
    steps: [
      {
        latex: "-4 + 7 = 3",
        note: "Sumamos de a dos.",
        plain: "Debías 4 y te llegan 7: pagás la deuda y te sobran 3.",
      },
      {
        latex: "3 + (-2) = 3 - 2 = 1",
        note: "Sumar un negativo es restar.",
        plain: "A esos 3 les sumás una deuda de 2, así que te queda 1.",
      },
    ],
  },
  glossary: [
    { term: "números enteros", plain: "Los números 'redondos', sin decimales: …, −2, −1, 0, 1, 2, … Incluyen los positivos, el cero y los negativos." },
    { term: "positivos", plain: "Los números mayores que 0 (1, 2, 3…). Es lo que 'tenés' o lo que sumás." },
    { term: "negativos", plain: "Los números menores que 0 (−1, −2, −3…). Es lo que 'debés' o lo que restás." },
    { term: "recta numérica", plain: "Una línea con los números en orden: el 0 en el medio, los negativos a la izquierda y los positivos a la derecha, como un termómetro acostado." },
    { term: "regla de signos", plain: "La regla para multiplicar con signos: iguales dan + (positivo), distintos dan − (negativo)." },
  ],
};
