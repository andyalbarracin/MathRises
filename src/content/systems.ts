import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const SISTEMAS_CONCEPT_ID = "sistemas-ecuaciones";

export const sistemasConcept: Concept = {
  id: SISTEMAS_CONCEPT_ID,
  slug: "sistemas-de-ecuaciones",
  title: "Sistemas de ecuaciones",
  description: "Resolver sistemas 2×2 por sustitución o eliminación.",
  module: "FUNCIONES",
  prerequisites: ["ecuaciones-lineales"],
  difficulty: "hard",
  targetWeek: 14,
  masteryRequired: 4,
  tags: ["funciones", "sistemas"],
};

export const sistemasLesson: LessonContent = {
  explanation: {
    title: "Dos ecuaciones, dos incógnitas",
    mentor: "vector",
    body: [
      "Un sistema 2×2 tiene dos ecuaciones con dos incógnitas (x e y). Resolverlo es encontrar el par (x, y) que cumple ambas a la vez.",
      "Por sustitución: despejás una variable en una ecuación y la reemplazás en la otra, para quedarte con una sola incógnita.",
      "Por eliminación: sumás o restás las ecuaciones (multiplicándolas si hace falta) para cancelar una variable. Gráficamente, la solución es el punto donde se cruzan las dos rectas.",
    ],
    simple: [
      "Tenés dos pistas (ecuaciones) sobre dos números desconocidos (x e y). Combinándolas encontrás el par que cumple las dos a la vez.",
      "Un truco: si sumás las dos ecuaciones y una variable se borra sola, te queda una ecuación fácil de una sola incógnita.",
    ],
    recall: {
      conceptId: "ecuaciones-lineales",
      title: "¿Te acordás de despejar?",
      text: "Cada paso usa lo que ya sabés de ecuaciones lineales: despejar una incógnita.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}",
    steps: [
      {
        latex: "2x = 6",
        note: "Sumamos las dos ecuaciones (se cancela y).",
        plain: "Al sumar, +y y −y se cancelan, y queda x + x = 5 + 1, o sea 2x = 6.",
      },
      {
        latex: "x = 3, \\quad y = 2",
        note: "Despejamos x y luego y.",
        plain: "De 2x = 6 sale x = 3. Reemplazando en x + y = 5, queda y = 2.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "sistema", plain: "Dos (o más) ecuaciones que tienen que cumplirse al mismo tiempo. La solución sirve para todas." },
    { term: "incógnitas", plain: "Los valores desconocidos que buscamos. En un sistema 2×2 son dos: x e y." },
    { term: "sustitución", plain: "Despejar una variable en una ecuación y meterla en la otra, para quedar con una sola incógnita." },
    { term: "eliminación", plain: "Sumar o restar las ecuaciones para que una variable se cancele." },
  ],
};
