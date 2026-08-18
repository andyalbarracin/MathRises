import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const FACTOR2_CONCEPT_ID = "factorizacion-2";

export const factor2Concept: Concept = {
  id: FACTOR2_CONCEPT_ID,
  slug: "factorizacion-ii-y-racionales",
  title: "Factorización II y racionales",
  description: "Trinomios, simplificar expresiones racionales y su dominio.",
  module: "ALGEBRA",
  prerequisites: ["factorizacion-1"],
  difficulty: "hard",
  targetWeek: 6,
  masteryRequired: 4,
  tags: ["algebra", "factorizacion", "racionales"],
};

export const factor2Lesson: LessonContent = {
  explanation: {
    title: "Factorizar para simplificar",
    mentor: "sigma",
    body: [
      "Un trinomio x² + bx + c se factoriza buscando dos números que sumen b y multipliquen c: quedan (x + p)(x + q).",
      "Para simplificar una expresión racional, factorizás numerador y denominador y cancelás los factores comunes. Por ejemplo, (x² - 9)/(x - 3) = (x + 3)(x - 3)/(x - 3) = x + 3.",
      "Ojo con el dominio: hay que excluir los valores que anulan el denominador, porque ahí la expresión no está definida.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\dfrac{x^2 - 25}{x - 5}",
    steps: [
      { latex: "\\dfrac{(x + 5)(x - 5)}{x - 5}", note: "Factorizamos (diferencia de cuadrados)." },
      { latex: "= x + 5 \\quad (x \\neq 5)", note: "Cancelamos, excluyendo x = 5." },
    ],
  },
};
