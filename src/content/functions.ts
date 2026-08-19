import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const FUNCION_CONCEPT_ID = "concepto-funcion";

export const funcionConcept: Concept = {
  id: FUNCION_CONCEPT_ID,
  slug: "concepto-de-funcion",
  title: "Concepto de función",
  description: "Evaluar funciones y encontrar su dominio.",
  module: "FUNCIONES",
  prerequisites: ["expresiones-algebraicas"],
  difficulty: "medium",
  targetWeek: 12,
  masteryRequired: 4,
  tags: ["funciones", "dominio"],
};

export const funcionLesson: LessonContent = {
  explanation: {
    title: "Una máquina que transforma números",
    mentor: "sigma",
    body: [
      "Una función f asigna a cada valor de entrada x un único valor de salida f(x). Evaluarla es reemplazar x por un número y calcular: si f(x) = 2x + 1, entonces f(3) = 7.",
      "El dominio es el conjunto de valores de x que la función acepta. Casi siempre es todos los reales, salvo dos casos que dan problemas.",
      "No se puede dividir por cero: en f(x) = 1/(x - 2), el 2 queda excluido. Y no hay raíz cuadrada de un número negativo: en f(x) = √(x - 2), hace falta x ≥ 2.",
    ],
    simple: [
      "Pensá la función como una maquinita: metés un número por un lado (la x) y sale otro por el otro (f(x)). La misma entrada siempre da la misma salida.",
      "El dominio son los números que la maquinita acepta. Se traba en dos casos: si hay que dividir por cero, o sacar raíz de un negativo. Esos valores quedan afuera.",
    ],
    recall: {
      conceptId: "expresiones-algebraicas",
      title: "¿Te acordás de evaluar expresiones?",
      text: "Evaluar una función es lo mismo que evaluar una expresión: reemplazás la letra por un número y hacés la cuenta.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "f(x) = \\dfrac{1}{x - 5}",
    steps: [
      {
        latex: "x - 5 \\neq 0 \\;\\Rightarrow\\; x \\neq 5",
        note: "El denominador no puede ser cero.",
        plain: "Buscamos qué valor haría 0 el denominador: x = 5. Ese queda prohibido.",
      },
      {
        latex: "\\text{Dom} = \\mathbb{R} - \\{5\\}",
        note: "Todos los reales menos 5.",
        plain: "El dominio son todos los números reales, salvo el 5.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "función", plain: "Una regla que a cada número de entrada le asigna un único número de salida. Como una máquina: metés un número y sale otro." },
    { term: "dominio", plain: "Los valores de entrada (x) que la función acepta. Casi siempre todos los números, salvo los que rompen la cuenta." },
    { term: "f(x)", plain: "Se lee 'f de x': el resultado (la salida) de la función para ese valor de x." },
  ],
};
