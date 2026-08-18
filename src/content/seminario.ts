import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

export const SEMINARIO_CONCEPT_ID = "seminario";

export const seminarioConcept: Concept = {
  id: SEMINARIO_CONCEPT_ID,
  slug: "seminario-comprension-lectora",
  title: "Comprensión lectora",
  description: "Entender textos, idea principal y conectores.",
  module: "SEMINARIO",
  prerequisites: [],
  difficulty: "medium",
  targetWeek: 22,
  masteryRequired: 4,
  tags: ["seminario", "lectura", "comprension"],
};

export const seminarioLesson: LessonContent = {
  explanation: {
    title: "Leer para entender, no solo pasar los ojos",
    mentor: "morgan",
    body: [
      "Comprender un texto es identificar de qué habla (el tema), qué dice sobre eso (la idea principal) y cómo se relacionan las ideas entre sí.",
      "La idea principal es el mensaje central: casi siempre se puede resumir en una sola oración. El resto del texto la explica, la ejemplifica o la justifica; no confundas un detalle con la idea principal.",
      "Los conectores son palabras que unen ideas y marcan su relación: consecuencia (por lo tanto, por eso), oposición (sin embargo, pero), suma (además) y causa (porque).",
    ],
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "A \\;\\xrightarrow{\\text{por lo tanto}}\\; B",
    steps: [
      { latex: "\\text{causa} \\;\\rightarrow\\; \\text{consecuencia}", note: "'Por lo tanto' indica que B es consecuencia de A." },
    ],
  },
};
