import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const ORDEN_CONCEPT_ID = "orden-operaciones";

export const ordenConcept: Concept = {
  id: ORDEN_CONCEPT_ID,
  slug: "orden-de-operaciones",
  title: "Orden de operaciones",
  description: "Qué se resuelve primero: paréntesis, multiplicación y división, suma y resta.",
  module: "FUNDAMENTOS",
  prerequisites: ["enteros-signos"],
  difficulty: "easy",
  targetWeek: 1,
  masteryRequired: 4,
  tags: ["orden", "operaciones", "fundamentos"],
};

export const ordenLesson: LessonContent = {
  explanation: {
    title: "No se resuelve de izquierda a derecha",
    mentor: "vector",
    body: [
      "Cuando hay varias operaciones, hay un orden de prioridad: primero lo que está entre paréntesis, después potencias y raíces, luego multiplicaciones y divisiones, y al final sumas y restas.",
      "Por eso 2 + 3 × 4 no es 20: primero 3 × 4 = 12, y después 2 + 12 = 14.",
      "Los paréntesis cambian la prioridad: (2 + 3) × 4 sí es 20, porque el paréntesis va primero.",
    ],
    simple: [
      "Es como vestirse: hay un orden. No te ponés los zapatos antes que las medias. En matemática, primero los paréntesis, después las potencias, después multiplicar y dividir, y al final sumar y restar.",
      "Truco rápido: multiplicar y dividir 'pesan' más que sumar y restar, así que se hacen antes.",
    ],
    recall: {
      conceptId: "enteros-signos",
      title: "¿Te acordás de los signos?",
      text: "Cuando aparezcan números negativos en estas cuentas, valen las mismas reglas de signos que viste en números enteros.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "(6 + 2) \\times 3 - 5",
    steps: [
      {
        latex: "(6 + 2) \\times 3 - 5 = 8 \\times 3 - 5",
        note: "Primero el paréntesis.",
        plain: "Resolvemos lo de adentro del paréntesis: 6 + 2 = 8.",
      },
      {
        latex: "= 24 - 5",
        note: "Después la multiplicación.",
        plain: "La multiplicación va antes que la resta: 8 × 3 = 24.",
      },
      {
        latex: "= 19",
        note: "Por último, la resta.",
        plain: "Y recién al final restamos: 24 − 5 = 19.",
      },
    ],
  },
  glossary: [
    { term: "operaciones", plain: "Las cuentas: sumar, restar, multiplicar, dividir, elevar a una potencia o sacar raíz." },
    { term: "prioridad", plain: "El orden en que se hacen las cuentas cuando hay varias juntas." },
    { term: "paréntesis", plain: "Los signos ( ). Lo que está adentro se resuelve primero, sí o sí." },
    { term: "potencias", plain: "Multiplicar un número por sí mismo varias veces. 2³ = 2 × 2 × 2." },
  ],
};
