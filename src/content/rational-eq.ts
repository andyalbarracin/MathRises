import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const RACIONALES_CONCEPT_ID = "ecuaciones-racionales";

export const racionalesConcept: Concept = {
  id: RACIONALES_CONCEPT_ID,
  slug: "ecuaciones-racionales",
  title: "Ecuaciones racionales",
  description: "Ecuaciones con fracciones, proporciones y valores prohibidos.",
  module: "ECUACIONES",
  prerequisites: ["ecuaciones-lineales"],
  difficulty: "hard",
  targetWeek: 9,
  masteryRequired: 4,
  tags: ["ecuaciones", "racionales", "dominio"],
};

export const racionalesLesson: LessonContent = {
  explanation: {
    title: "Fracciones con la incógnita abajo",
    mentor: "vector",
    body: [
      "Una ecuación racional tiene la incógnita en un denominador. Para resolverla, multiplicás ambos lados por el denominador y te queda una ecuación más simple.",
      "Cuando es una proporción (una fracción igual a otra), podés multiplicar en cruz: a/b = c/d se convierte en a·d = b·c.",
      "Siempre hay que verificar: los valores que anulan un denominador están prohibidos, aunque aparezcan al resolver. Esas son las 'raíces prohibidas' o soluciones no válidas.",
    ],
    simple: [
      "Las fracciones molestan: el truco es multiplicar todo por el denominador para que desaparezcan y quede una ecuación normal.",
      "Ojo con dividir por cero: si al final te da un valor que haría cero un denominador, ese valor NO vale, aunque haya salido de la cuenta.",
    ],
    recall: {
      conceptId: "ecuaciones-lineales",
      title: "¿Te acordás de despejar?",
      text: "Después de sacar las fracciones te queda una ecuación lineal común, que resolvés despejando como ya sabés.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\dfrac{12}{x} = 4",
    steps: [
      {
        latex: "12 = 4x",
        note: "Multiplicamos ambos lados por x.",
        plain: "Multiplicamos los dos lados por x para que la fracción 12/x desaparezca: (12/x)·x = 12.",
      },
      {
        latex: "x = \\dfrac{12}{4} = 3",
        note: "Despejamos (y x ≠ 0).",
        plain: "Dividimos por 4. Y verificamos que x ≠ 0 (acá x = 3, así que vale).",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "ecuación racional", plain: "Una ecuación con la incógnita en un denominador (abajo de una fracción), como 12/x = 4." },
    { term: "proporción", plain: "Una igualdad entre dos fracciones, como a/b = c/d." },
    { term: "multiplicar en cruz", plain: "En una proporción a/b = c/d, hacer a·d = b·c. Un atajo para sacar las fracciones." },
    { term: "denominador", plain: "El número (o expresión) de abajo de una fracción. Nunca puede ser cero." },
  ],
};
