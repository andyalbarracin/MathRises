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
    simple: [
      "Una función cuadrática dibuja una 'U' (parábola). Si el número que acompaña a x² es positivo, la U abre hacia arriba; si es negativo, hacia abajo.",
      "El vértice es la puntita de la U (el punto más bajo o más alto). Su x se saca con la fórmula −b/(2a).",
    ],
    recall: {
      conceptId: "ecuaciones-cuadraticas",
      title: "¿Te acordás de resolver cuadráticas?",
      text: "Las raíces de la parábola son las soluciones de la ecuación ax² + bx + c = 0, que ya sabés factorizar.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "y = x^2 - 6x + 8",
    steps: [
      {
        latex: "x_v = \\dfrac{-(-6)}{2\\cdot 1} = 3",
        note: "x del vértice.",
        plain: "La x del vértice sale de −b/(2a). Acá b = −6 y a = 1: −(−6)/2 = 3.",
      },
      {
        latex: "(x - 2)(x - 4) = 0 \\;\\Rightarrow\\; x = 2, \\; x = 4",
        note: "Raíces (corta al eje x).",
        plain: "Las raíces (donde corta el eje x) salen de factorizar: 2 y 4 suman 6 y multiplican 8.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "parábola", plain: "La curva con forma de 'U' (o 'U' dada vuelta) que dibuja una función cuadrática." },
    { term: "concavidad", plain: "Hacia dónde abre la parábola: hacia arriba (a > 0) o hacia abajo (a < 0)." },
    { term: "vértice", plain: "La punta de la parábola: su punto más bajo (si abre hacia arriba) o más alto (si abre hacia abajo)." },
    { term: "raíces", plain: "Los valores de x donde la parábola toca el eje horizontal (donde y = 0)." },
  ],
};
