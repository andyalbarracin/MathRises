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
    simple: [
      "Pensá la x como una cajita con un número adentro que todavía no sabés cuál es. Podés operar con la cajita como si fuera un número.",
      "Solo se suman cosas del mismo tipo: 3 'equis' + 2 'equis' = 5 'equis' (3x + 2x = 5x), igual que 3 manzanas + 2 manzanas = 5 manzanas. Pero manzanas con peras (3x + 3) no se juntan.",
    ],
    recall: {
      conceptId: "orden-operaciones",
      title: "¿Te acordás del orden de operaciones?",
      text: "Al operar y evaluar con letras valen las mismas reglas: primero paréntesis, después multiplicar y dividir, y al final sumar y restar.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "3(x + 4) - x",
    steps: [
      {
        latex: "3(x + 4) - x = 3x + 12 - x",
        note: "Aplicamos la distributiva.",
        plain: "El 3 de afuera entra a multiplicar a cada uno de adentro: 3·x = 3x y 3·4 = 12.",
      },
      {
        latex: "= 2x + 12",
        note: "Reducimos términos semejantes.",
        plain: "Juntamos las 'equis': 3x − x = 2x. El 12 queda solo porque no tiene letra.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "variable", plain: "Una letra (como x) que representa un número que todavía no conocemos o que puede cambiar." },
    { term: "términos semejantes", plain: "Términos con exactamente la misma letra (y exponente). 3x y 2x son semejantes; 3x y 3 no." },
    { term: "término", plain: "Cada 'pedacito' de la expresión separado por + o −. En 3x + 5, los términos son 3x y 5." },
    { term: "distributiva", plain: "Repartir una multiplicación sobre una suma: a(x + b) = a·x + a·b. El de afuera multiplica a cada uno de adentro." },
    { term: "evaluar", plain: "Reemplazar la letra por un número y hacer la cuenta. Evaluar 2x en x = 5 da 10." },
  ],
};
