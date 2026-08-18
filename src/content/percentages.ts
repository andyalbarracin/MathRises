import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const PORCENTAJES_CONCEPT_ID = "porcentajes-proporciones";

export const porcentajesConcept: Concept = {
  id: PORCENTAJES_CONCEPT_ID,
  slug: "porcentajes-y-proporciones",
  title: "Porcentajes y proporciones",
  description: "Porcentajes, aumentos y regla de tres.",
  module: "FUNDAMENTOS",
  prerequisites: ["fracciones-basicas"],
  difficulty: "easy",
  targetWeek: 2,
  masteryRequired: 4,
  tags: ["porcentajes", "proporciones", "fundamentos"],
};

export const porcentajesLesson: LessonContent = {
  explanation: {
    title: "Un porcentaje es una fracción sobre 100",
    mentor: "morgan",
    body: [
      "El X% de un número es ese número multiplicado por X y dividido por 100. Por ejemplo, el 20% de 50 es 50 × 20 ÷ 100 = 10.",
      "Para un aumento, calculás el porcentaje y lo sumás al valor original. Un producto de $100 con 25% de aumento pasa a valer 100 + 25 = 125.",
      "La regla de tres directa sirve para proporciones: si 3 unidades cuestan $12, una cuesta 12 ÷ 3 = 4, y 5 unidades cuestan 5 × 4 = 20.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "30\\% \\text{ de } 80",
    steps: [
      { latex: "30\\% = \\dfrac{30}{100}", note: "El porcentaje como fracción." },
      { latex: "\\dfrac{30}{100} \\times 80 = 24", note: "Multiplicamos por el total." },
    ],
  },
};
