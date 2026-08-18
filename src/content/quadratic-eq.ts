import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const CUADRATICAS_CONCEPT_ID = "ecuaciones-cuadraticas";

export const cuadraticasConcept: Concept = {
  id: CUADRATICAS_CONCEPT_ID,
  slug: "ecuaciones-cuadraticas",
  title: "Cuadráticas y valor absoluto",
  description: "Resolver x² = k, factorizar y calcular el discriminante.",
  module: "ECUACIONES",
  prerequisites: ["ecuaciones-lineales", "factorizacion-1"],
  difficulty: "hard",
  targetWeek: 8,
  masteryRequired: 4,
  tags: ["ecuaciones", "cuadraticas"],
};

export const cuadraticasLesson: LessonContent = {
  explanation: {
    title: "Cuando aparece x², suele haber dos soluciones",
    mentor: "sigma",
    body: [
      "Al despejar una x² con raíz cuadrada aparecen dos soluciones: una positiva y una negativa. Por ejemplo, x² = 49 → x = ±7.",
      "Muchas cuadráticas se resuelven factorizando: buscás dos números que sumen el coeficiente del medio y multipliquen el término independiente. En x² - 5x + 6 = 0 son 2 y 3, así que x = 2 o x = 3.",
      "El discriminante Δ = b² - 4ac indica cuántas soluciones reales hay: positivo (dos), cero (una) o negativo (ninguna real).",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "x^2 - 7x + 12 = 0",
    steps: [
      { latex: "(x - 3)(x - 4) = 0", note: "3 y 4 suman 7 y multiplican 12." },
      { latex: "x = 3 \\;\\text{o}\\; x = 4", note: "Cada factor igualado a cero." },
    ],
  },
};
