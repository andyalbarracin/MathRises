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
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "-2x < 6",
    steps: [
      { latex: "x > \\dfrac{6}{-2}", note: "Dividimos por -2: se invierte el sentido." },
      { latex: "x > -3 \\;\\Rightarrow\\; (-3,\\; +\\infty)", note: "Lo expresamos como intervalo." },
    ],
  },
};
