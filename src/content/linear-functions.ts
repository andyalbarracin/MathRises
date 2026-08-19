import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const FUNC_LINEAL_CONCEPT_ID = "funciones-lineales";

export const funcLinealConcept: Concept = {
  id: FUNC_LINEAL_CONCEPT_ID,
  slug: "funcion-lineal-y-rectas",
  title: "Función lineal y rectas",
  description: "Pendiente, rectas, paralelas y perpendiculares.",
  module: "FUNCIONES",
  prerequisites: ["concepto-funcion"],
  difficulty: "medium",
  targetWeek: 13,
  masteryRequired: 4,
  tags: ["funciones", "recta", "pendiente"],
};

export const funcLinealLesson: LessonContent = {
  explanation: {
    title: "La pendiente manda",
    mentor: "delta",
    body: [
      "Una función lineal se escribe y = mx + b. La pendiente m indica la inclinación de la recta, y b es la ordenada al origen (dónde corta al eje y).",
      "La pendiente entre dos puntos es la variación de y sobre la variación de x: m = (y₂ - y₁) / (x₂ - x₁).",
      "Dos rectas son paralelas si tienen la misma pendiente, y perpendiculares si el producto de sus pendientes es -1 (por ejemplo, 2 y -1/2).",
    ],
    simple: [
      "Una función lineal es una recta. Dos datos la definen: cuánto sube o baja (la pendiente m) y a qué altura arranca (la b).",
      "La pendiente es 'cuánto subís por cada paso a la derecha'. Si por cada 1 a la derecha subís 2, la pendiente es 2.",
    ],
    recall: {
      conceptId: "concepto-funcion",
      title: "¿Te acordás de qué es una función?",
      text: "La recta y = mx + b es una función: a cada x le da una y. Acá le ponemos nombre a sus partes.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "A(1;\\, 2), \\quad B(4;\\, 8)",
    steps: [
      {
        latex: "m = \\dfrac{8 - 2}{4 - 1} = \\dfrac{6}{3}",
        note: "Variación de y sobre variación de x.",
        plain: "La pendiente es cuánto cambió la altura (y) dividido cuánto cambió el horizontal (x): subió 6 mientras avanzó 3.",
      },
      {
        latex: "= 2",
        note: "La pendiente es 2.",
        plain: "6 ÷ 3 = 2. Por cada paso a la derecha, la recta sube 2.",
      },
    ],
  },
  materials: ["papel y lápiz", "regla"],
  glossary: [
    { term: "función lineal", plain: "Una función cuyo gráfico es una recta. Se escribe y = mx + b." },
    { term: "pendiente", plain: "El número m: qué tan inclinada está la recta. Positiva sube, negativa baja; más grande, más empinada." },
    { term: "ordenada al origen", plain: "El número b: la altura donde la recta corta al eje vertical (y)." },
    { term: "paralelas", plain: "Dos rectas que nunca se cruzan porque tienen la misma pendiente." },
    { term: "perpendiculares", plain: "Dos rectas que se cruzan formando 90°. El producto de sus pendientes da −1." },
  ],
};
