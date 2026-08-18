import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const FUNC_CUADRATICA_CONCEPT_ID = "funciones-cuadraticas";

export const funcCuadraticaConcept: Concept = {
  id: FUNC_CUADRATICA_CONCEPT_ID,
  slug: "funcion-cuadratica",
  title: "Función cuadrática",
  description: "Parábola: vértice, concavidad y raíces.",
  module: "FUNCIONES",
  prerequisites: ["ecuaciones-cuadraticas"],
  difficulty: "hard",
  targetWeek: 15,
  masteryRequired: 4,
  tags: ["funciones", "parabola", "cuadratica"],
};

export const funcCuadraticaLesson: LessonContent = {
  explanation: {
    title: "La parábola y sus elementos",
    mentor: "delta",
    body: [
      "La función cuadrática y = ax² + bx + c dibuja una parábola. El signo de a decide la concavidad: si a > 0 abre hacia arriba, si a < 0 abre hacia abajo.",
      "El vértice es el punto más bajo (o más alto) de la parábola. Su coordenada x se calcula con x = -b / (2a).",
      "Las raíces son los puntos donde la parábola corta al eje x (donde y = 0). Se encuentran factorizando o con la fórmula resolvente.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "y = x^2 - 6x + 8",
    steps: [
      { latex: "x_v = \\dfrac{-(-6)}{2\\cdot 1} = 3", note: "x del vértice." },
      { latex: "(x - 2)(x - 4) = 0 \\;\\Rightarrow\\; x = 2, \\; x = 4", note: "Raíces (corta al eje x)." },
    ],
  },
};
