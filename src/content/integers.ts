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
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "-4 + (7) + (-2)",
    steps: [
      { latex: "-4 + 7 = 3", note: "Sumamos de a dos." },
      { latex: "3 + (-2) = 3 - 2 = 1", note: "Sumar un negativo es restar." },
    ],
  },
};
