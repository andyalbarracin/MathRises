import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const INECUACIONES_CONCEPT_ID = "inecuaciones";

export const inecuacionesConcept: Concept = {
  id: INECUACIONES_CONCEPT_ID,
  slug: "inecuaciones-intervalos",
  title: "Inecuaciones e intervalos",
  description: "Resolver desigualdades y expresar la solución como intervalo.",
  module: "ECUACIONES",
  prerequisites: ["ecuaciones-lineales"],
  difficulty: "medium",
  targetWeek: 10,
  masteryRequired: 4,
  tags: ["ecuaciones", "inecuaciones", "intervalos"],
};

export const inecuacionesLesson: LessonContent = {
  explanation: {
    title: "Casi como una ecuación, con una trampa",
    mentor: "sigma",
    body: [
      "Una inecuación se resuelve casi igual que una ecuación, despejando la x. La diferencia clave está en los negativos.",
      "Si multiplicás o dividís ambos lados por un número negativo, el sentido de la desigualdad se invierte: -x > 3 se convierte en x < -3.",
      "La solución se escribe como intervalo. El infinito siempre lleva paréntesis; el corchete se usa solo cuando el extremo está incluido (≤ o ≥). Así, x > 2 es (2, +∞).",
    ],
    simple: [
      "Una inecuación se resuelve casi igual que una ecuación: despejás la x. Pero la respuesta no es un número, sino 'todos los que son mayores (o menores) que...'.",
      "La única trampa: si multiplicás o dividís por un número negativo, el signo se da vuelta. −x > 3 se convierte en x < −3 (el > pasa a <).",
    ],
    recall: {
      conceptId: "ecuaciones-lineales",
      title: "¿Te acordás de despejar ecuaciones?",
      text: "Se despeja igual que una ecuación lineal; lo único que cambia es la regla del número negativo.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "-2x < 6",
    steps: [
      {
        latex: "x > \\dfrac{6}{-2}",
        note: "Dividimos por -2: se invierte el sentido.",
        plain: "Dividimos los dos lados por −2. Como es negativo, el < se da vuelta y pasa a >.",
      },
      {
        latex: "x > -3 \\;\\Rightarrow\\; (-3,\\; +\\infty)",
        note: "Lo expresamos como intervalo.",
        plain: "6 ÷ (−2) = −3. La respuesta es 'todos los mayores que −3', que se escribe (−3, +∞).",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "inecuación", plain: "Como una ecuación pero con <, >, ≤ o ≥ en vez de =. La respuesta es un rango de valores, no uno solo." },
    { term: "desigualdad", plain: "La relación 'mayor que' (>) o 'menor que' (<) entre dos cosas." },
    { term: "intervalo", plain: "La forma de escribir un rango de números. (2, +∞) significa 'todos los mayores que 2'." },
    { term: "infinito", plain: "Algo sin fin (+∞ o −∞). Nunca se 'alcanza', por eso siempre lleva paréntesis, no corchete." },
  ],
};
