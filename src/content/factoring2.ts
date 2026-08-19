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
    simple: [
      "Simplificar una fracción con letras es como simplificar 6/9 = 2/3: primero encontrás los factores de arriba y abajo, y tachás los que se repiten.",
      "Cuidado con dividir por cero: si al cancelar (x − 3) el valor x = 3 haría cero ese denominador, hay que aclarar que x no puede ser 3.",
    ],
    recall: {
      conceptId: "factorizacion-1",
      title: "¿Te acordás de factorizar?",
      text: "Para simplificar estas fracciones primero factorizás arriba y abajo (diferencia de cuadrados, factor común…), como en Factorización I.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\dfrac{x^2 - 25}{x - 5}",
    steps: [
      {
        latex: "\\dfrac{(x + 5)(x - 5)}{x - 5}",
        note: "Factorizamos (diferencia de cuadrados).",
        plain: "Arriba, x² − 25 es diferencia de cuadrados: (x + 5)(x − 5). Abajo ya está (x − 5).",
      },
      {
        latex: "= x + 5 \\quad (x \\neq 5)",
        note: "Cancelamos, excluyendo x = 5.",
        plain: "El factor (x − 5) está arriba y abajo: se cancela. Aclaramos x ≠ 5 porque ahí el denominador original valía 0.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "expresión racional", plain: "Una fracción donde arriba y abajo hay polinomios, como (x² − 9)/(x − 3)." },
    { term: "cancelar", plain: "Eliminar un factor que aparece igual arriba y abajo de una fracción, porque dividido por sí mismo da 1." },
    { term: "dominio", plain: "Los valores que la letra SÍ puede tomar. Se excluyen los que hacen 0 el denominador (ahí la fracción no existe)." },
    { term: "trinomio", plain: "Un polinomio de tres términos, como x² + 5x + 6." },
  ],
};
