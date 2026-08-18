import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const EXPLOG_CONCEPT_ID = "exp-log";

export const explogConcept: Concept = {
  id: EXPLOG_CONCEPT_ID,
  slug: "exponenciales-y-logaritmos",
  title: "Exponenciales y logaritmos",
  description: "Logaritmos, ecuaciones exponenciales y propiedades.",
  module: "EXP_LOG",
  prerequisites: ["potencias-radicales"],
  difficulty: "hard",
  targetWeek: 20,
  masteryRequired: 4,
  tags: ["exponenciales", "logaritmos"],
};

export const explogLesson: LessonContent = {
  explanation: {
    title: "El logaritmo pregunta por el exponente",
    mentor: "sigma",
    body: [
      "El logaritmo es la operación inversa de la potencia. log_b(x) = n significa que b^n = x. Por ejemplo, log₂(8) = 3 porque 2³ = 8.",
      "Para resolver una ecuación exponencial como 2^x = 16, conviene escribir el número como potencia de la misma base: 16 = 2⁴, así que x = 4.",
      "Propiedades clave: el log de un producto es la suma de los logs, el de un cociente es la resta, y en una potencia el exponente 'baja' como factor: log(a^n) = n·log(a).",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "3^x = 81",
    steps: [
      { latex: "81 = 3^4", note: "Escribimos 81 como potencia de 3." },
      { latex: "3^x = 3^4 \\;\\Rightarrow\\; x = 4", note: "Igualamos los exponentes." },
    ],
  },
};
