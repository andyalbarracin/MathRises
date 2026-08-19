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
    simple: [
      "Cuando hay una x al cuadrado, casi siempre hay DOS respuestas. Si x² = 49, x puede ser 7 o −7, porque los dos, al cuadrado, dan 49.",
      "Truco muy usado: buscar dos números que sumados den el número del medio y multiplicados den el último. En x² − 5x + 6, son 2 y 3 (suman 5, multiplican 6).",
    ],
    recall: {
      conceptId: "factorizacion-1",
      title: "¿Te acordás de factorizar trinomios?",
      text: "Muchas cuadráticas se resuelven factorizando el trinomio, tal como practicaste en Factorización.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "x^2 - 7x + 12 = 0",
    steps: [
      {
        latex: "(x - 3)(x - 4) = 0",
        note: "3 y 4 suman 7 y multiplican 12.",
        plain: "Buscamos dos números que sumen 7 y multipliquen 12: son 3 y 4. Entonces x² − 7x + 12 = (x − 3)(x − 4).",
      },
      {
        latex: "x = 3 \\;\\text{o}\\; x = 4",
        note: "Cada factor igualado a cero.",
        plain: "Si una multiplicación da 0, alguno de los factores es 0: x − 3 = 0 (x = 3) o x − 4 = 0 (x = 4).",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "soluciones", plain: "Los valores de x que hacen verdadera la ecuación. Una cuadrática puede tener dos." },
    { term: "término independiente", plain: "El número que va solo, sin letra. En x² − 5x + 6, es el 6." },
    { term: "discriminante", plain: "El número Δ = b² − 4ac. Su signo dice cuántas soluciones reales hay: dos (+), una (0) o ninguna (−)." },
  ],
};
