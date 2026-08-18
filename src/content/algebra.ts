import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const EXPRESIONES_CONCEPT_ID = "expresiones-algebraicas";

export const expresionesConcept: Concept = {
  id: EXPRESIONES_CONCEPT_ID,
  slug: "expresiones-algebraicas",
  title: "Expresiones algebraicas",
  description: "Términos semejantes, distributiva y evaluación.",
  module: "ALGEBRA",
  prerequisites: ["orden-operaciones"],
  difficulty: "easy",
  targetWeek: 3,
  masteryRequired: 4,
  tags: ["algebra", "expresiones"],
};

export const expresionesLesson: LessonContent = {
  explanation: {
    title: "Letras que representan números",
    mentor: "vector",
    body: [
      "Una variable (como x) representa un número cualquiera. Un término es un número con una letra, por ejemplo 3x.",
      "Términos semejantes son los que tienen la misma parte con letra: 3x y 2x lo son, y se pueden sumar (3x + 2x = 5x). En cambio 3x y 3 no son semejantes.",
      "La distributiva reparte una multiplicación sobre una suma: a(x + b) = a·x + a·b. Y evaluar una expresión es reemplazar la letra por un número y calcular.",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "3(x + 4) - x",
    steps: [
      { latex: "3(x + 4) - x = 3x + 12 - x", note: "Aplicamos la distributiva." },
      { latex: "= 2x + 12", note: "Reducimos términos semejantes." },
    ],
  },
};
