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
      "El X% (por ciento) de un número es ese número multiplicado por X y dividido por 100. Por ejemplo, el 20% de 50 es 50 × 20 ÷ 100 = 10.",
      "Para un aumento, calculás el porcentaje y lo sumás al valor original. Un producto de $100 con 25% de aumento pasa a valer 100 + 25 = 125.",
      "La regla de tres directa sirve para proporciones: si 3 unidades cuestan $12, una cuesta 12 ÷ 3 = 4, y 5 unidades cuestan 5 × 4 = 20.",
    ],
    simple: [
      "Porcentaje quiere decir 'de cada 100'. El 20% de algo es como partirlo en 100 pedacitos iguales y agarrar 20 de esos.",
      "Para sacar el 20% de 50: multiplicás 50 × 20 y dividís por 100. Da 10. Siempre el mismo truco: por el porcentaje, dividido 100.",
    ],
    recall: {
      conceptId: "fracciones-basicas",
      title: "¿Te acordás de las fracciones?",
      text: "Un porcentaje es una fracción con denominador 100. 25% es lo mismo que 25/100, que simplificado es 1/4.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "30\\% \\text{ de } 80",
    steps: [
      {
        latex: "30\\% = \\dfrac{30}{100}",
        note: "El porcentaje como fracción.",
        plain: "30% es 30 de cada 100: la fracción 30/100.",
      },
      {
        latex: "\\dfrac{30}{100} \\times 80 = 24",
        note: "Multiplicamos por el total.",
        plain: "La palabra 'de' significa multiplicar: 30/100 × 80 = 24.",
      },
    ],
  },
  glossary: [
    { term: "por ciento", plain: "Quiere decir 'de cada 100'. 20 por ciento (20%) es 20 de cada 100." },
    { term: "regla de tres", plain: "Un truco para encontrar un valor que falta cuando dos cantidades son proporcionales (si 3 cuestan 12, ¿cuánto cuestan 5?)." },
    { term: "proporciones", plain: "Cuando dos cantidades crecen juntas manteniendo la misma relación. Si 1 café cuesta $4, 2 cafés cuestan $8." },
    { term: "porcentaje", plain: "Una parte de cada 100. 20% quiere decir 20 de cada 100, o sea 20/100." },
  ],
};
