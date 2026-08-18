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
    simple: [
      "Una potencia es multiplicar repetido, no sumar. 2³ NO es 2 × 3 = 6; es 2 × 2 × 2 = 8. El numerito de arriba cuenta cuántas veces multiplicás la base.",
      "La raíz cuadrada es la pregunta al revés: '¿qué número, multiplicado por sí mismo, me da 9?'. La respuesta es 3.",
    ],
    recall: {
      conceptId: "enteros-signos",
      title: "¿Te acordás de multiplicar?",
      text: "Una potencia es multiplicar el mismo número varias veces. Si tenés fresco cómo multiplicar, ya tenés medio camino hecho.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "3^2 + \\sqrt{16}",
    steps: [
      {
        latex: "3^2 = 3 \\times 3 = 9",
        note: "Primero la potencia.",
        plain: "3 al cuadrado es 3 × 3 = 9 (no 3 × 2).",
      },
      {
        latex: "\\sqrt{16} = 4",
        note: "Raíz de un cuadrado perfecto.",
        plain: "Buscamos qué número por sí mismo da 16: es 4, porque 4 × 4 = 16.",
      },
      {
        latex: "9 + 4 = 13",
        note: "Sumamos.",
        plain: "Juntamos los dos resultados: 9 + 4 = 13.",
      },
    ],
  },
  glossary: [
    { term: "potencia", plain: "Multiplicar un número por sí mismo varias veces. En 2³, multiplicás el 2 tres veces." },
    { term: "base", plain: "El número que se multiplica en una potencia. En 2³, la base es 2." },
    { term: "raíz cuadrada", plain: "La pregunta al revés: '¿qué número multiplicado por sí mismo da esto?'. √9 = 3 porque 3 × 3 = 9." },
    { term: "cuadrado perfecto", plain: "Un número que sale de multiplicar un entero por sí mismo: 4, 9, 16, 25… Su raíz da un número exacto." },
    { term: "exponente", plain: "El número chiquito de arriba. Dice cuántas veces se multiplica la base. En 2³, el exponente es 3." },
  ],
};
