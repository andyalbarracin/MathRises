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
    simple: [
      "Pensá la ecuación como una balanza equilibrada. Lo que le hacés a un lado (sumar, restar, dividir) se lo tenés que hacer al otro para que siga equilibrada.",
      "Para 3x − 5 = 10: primero pasás el −5 al otro lado (sumando +5), y después dividís por el 3 que acompaña a la x. Queda x = 5.",
    ],
    recall: {
      conceptId: "expresiones-algebraicas",
      title: "¿Te acordás de operar con letras?",
      text: "Resolver ecuaciones usa lo mismo que viste en expresiones: reducir términos semejantes y la distributiva.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "3x - 5 = 10",
    steps: [
      {
        latex: "3x = 10 + 5",
        note: "Pasamos el -5 sumando.",
        plain: "El −5 estaba restando de un lado; pasa al otro sumando. Como en la balanza: sumamos 5 a los dos lados.",
      },
      { latex: "3x = 15", note: "Operamos.", plain: "10 + 5 = 15." },
      {
        latex: "x = \\dfrac{15}{3} = 5",
        note: "Dividimos por el coeficiente.",
        plain: "La x está multiplicada por 3, así que dividimos los dos lados por 3.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "ecuación", plain: "Una igualdad con un signo = y una letra desconocida. Resolverla es encontrar el valor de la letra que hace verdadera la igualdad." },
    { term: "incógnita", plain: "El número desconocido que buscamos, casi siempre la x." },
    { term: "coeficiente", plain: "El número que multiplica a la incógnita. En 3x, el coeficiente es 3." },
  ],
};
