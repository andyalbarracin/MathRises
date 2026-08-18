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
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\dfrac{12}{x} = 4",
    steps: [
      { latex: "12 = 4x", note: "Multiplicamos ambos lados por x." },
      { latex: "x = \\dfrac{12}{4} = 3", note: "Despejamos (y x ≠ 0)." },
    ],
  },
};
