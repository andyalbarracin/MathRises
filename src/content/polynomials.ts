import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const POLINOMIOS_CONCEPT_ID = "polinomios";

export const polinomiosConcept: Concept = {
  id: POLINOMIOS_CONCEPT_ID,
  slug: "operaciones-con-polinomios",
  title: "Operaciones con polinomios",
  description: "Sumar polinomios, multiplicar monomios y productos notables.",
  module: "ALGEBRA",
  prerequisites: ["expresiones-algebraicas"],
  difficulty: "medium",
  targetWeek: 4,
  masteryRequired: 4,
  tags: ["algebra", "polinomios"],
};

export const polinomiosLesson: LessonContent = {
  explanation: {
    title: "Sumar semejantes, multiplicar exponentes",
    mentor: "vector",
    body: [
      "Para sumar polinomios se agrupan y suman los términos semejantes: (3x + 2) + (x - 5) = 4x - 3.",
      "Al multiplicar monomios, se multiplican los coeficientes y se suman los exponentes de la misma base: 2x · 3x = 6x².",
      "Producto notable del cuadrado de un binomio: (x + a)² = x² + 2·a·x + a². El error típico es olvidar el término del medio (2ax).",
    ],
    simple: [
      "Un polinomio es como una lista de compras con distintos tipos de cosas. Solo se juntan los del mismo tipo (los términos semejantes).",
      "El cuadrado de un binomio (x + 3)² NO es x² + 9. Falta el término del medio que casi todos se olvidan: (x + 3)² = x² + 6x + 9. La regla: cuadrado del primero, doble del primero por el segundo, cuadrado del segundo.",
    ],
    recall: {
      conceptId: "expresiones-algebraicas",
      title: "¿Te acordás de los términos semejantes?",
      text: "Sumar polinomios es juntar términos semejantes, lo mismo que viste en expresiones algebraicas.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "(x + 3)^2",
    steps: [
      {
        latex: "(x + 3)^2 = x^2 + 2\\cdot 3\\cdot x + 3^2",
        note: "Cuadrado, doble producto, cuadrado.",
        plain: "Cuadrado del primero (x²), doble del primero por el segundo (2·3·x), y cuadrado del segundo (3²).",
      },
      {
        latex: "= x^2 + 6x + 9",
        note: "Operamos.",
        plain: "Hacemos las cuentas: 2·3·x = 6x y 3² = 9.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "polinomio", plain: "Una suma de varios términos con letras y números, como 3x² + 2x − 5." },
    { term: "monomio", plain: "Un solo término: un número por una letra elevada a algo, como 6x²." },
    { term: "coeficiente", plain: "El número que multiplica a la letra. En 6x², el coeficiente es 6." },
    { term: "binomio", plain: "Un polinomio de dos términos, como (x + 3)." },
    { term: "producto notable", plain: "Multiplicaciones que aparecen tan seguido que conviene saberlas de memoria, como (x + a)²." },
  ],
};
