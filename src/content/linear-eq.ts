import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const LINEALES_CONCEPT_ID = "ecuaciones-lineales";

export const linealesConcept: Concept = {
  id: LINEALES_CONCEPT_ID,
  slug: "ecuaciones-lineales",
  title: "Ecuaciones lineales",
  description: "Despejar x en ecuaciones de primer grado.",
  module: "ECUACIONES",
  prerequisites: ["expresiones-algebraicas"],
  difficulty: "medium",
  targetWeek: 7,
  masteryRequired: 4,
  tags: ["ecuaciones", "lineales"],
};

export const linealesLesson: LessonContent = {
  explanation: {
    title: "Balanza: lo que hacés de un lado, hacelo del otro",
    mentor: "vector",
    body: [
      "Una ecuación es una igualdad con una incógnita. Resolverla es dejar la x sola de un lado.",
      "Pasá los términos sin x al otro lado cambiando el signo, y después dividí por el número que multiplica a la x. Por ejemplo, 2x + 6 = 14 → 2x = 8 → x = 4.",
      "Si hay paréntesis, podés dividir ambos lados por el número de afuera o aplicar la distributiva primero. Verificá reemplazando la solución.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "3x - 5 = 10",
    steps: [
      { latex: "3x = 10 + 5", note: "Pasamos el -5 sumando." },
      { latex: "3x = 15", note: "Operamos." },
      { latex: "x = \\dfrac{15}{3} = 5", note: "Dividimos por el coeficiente." },
    ],
  },
};
