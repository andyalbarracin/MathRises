import type { Concept } from "@/domain/types";

export const FRACCIONES_CONCEPT_ID = "fracciones-basicas";

export const fraccionesConcept: Concept = {
  id: FRACCIONES_CONCEPT_ID,
  slug: "fracciones-equivalencia-operaciones",
  title: "Fracciones: equivalencia y operaciones básicas",
  description:
    "Simplificar, reconocer fracciones equivalentes y sumar con distinto denominador.",
  module: "FUNDAMENTOS",
  prerequisites: [],
  difficulty: "easy",
  targetWeek: 1,
  masteryRequired: 4,
  tags: ["fracciones", "aritmética", "fundamentos"],
};

/** Término del glosario: se resalta en el texto y muestra una explicación simple. */
export interface GlossaryEntry {
  term: string; // término tal como aparece en el texto (p. ej. "denominador")
  plain: string; // explicación "como si tuvieras 10 años"
}

/** Mini-repaso de un concepto previo ("¿te acordás de…?"). */
export interface RecallNote {
  conceptId?: string; // concepto previo para enlazar (opcional)
  title: string;
  text: string;
}

/** Contenido de la mini-lección (cards de explicación previas a los ejercicios). */
export interface LessonContent {
  explanation: {
    title: string;
    body: string[];
    mentor: string; // slug del mentor
    /** Versión súper simple, desplegable ("explicámelo fácil"). */
    simple?: string[];
    /** Enganche con un concepto anterior. */
    recall?: RecallNote;
  };
  workedExample: {
    title: string;
    /** `plain` reescribe el paso en lenguaje llano (qué significa, no solo qué se hizo). */
    problemLatex: string;
    steps: { latex: string; note: string; plain?: string }[];
  };
  /** Términos técnicos con explicación simple, resaltados en el texto. */
  glossary?: GlossaryEntry[];
  /** Materiales físicos recomendados (papel, regla, compás, transportador…). */
  materials?: string[];
}

export const fraccionesLesson: LessonContent = {
  explanation: {
    title: "Un denominador común, no dos denominadores sumados",
    mentor: "sigma",
    body: [
      "Una fracción representa una parte de un todo: en 3/4, el 4 (el denominador) dice en cuántas partes iguales dividimos, y el 3 (el numerador) cuántas tomamos.",
      "Dos fracciones son equivalentes si se obtienen multiplicando (o dividiendo) numerador y denominador por el mismo número: 1/2 = 2/4 = 3/6.",
      "Para sumar o restar fracciones con distinto denominador, primero hay que llevarlas a un denominador común. El error más frecuente es sumar los denominadores: eso está mal.",
    ],
    simple: [
      "Pensá en una pizza. El número de abajo (denominador) es en cuántas porciones cortás la pizza. El de arriba (numerador) es cuántas porciones te toca comer.",
      "No podés sumar 1 pedazo de una pizza cortada en 2 con 1 pedazo de otra cortada en 3: los pedazos son de distinto tamaño. Primero hay que cortar las dos pizzas en pedazos del mismo tamaño (el mismo denominador) y recién ahí sumar cuántos pedazos tenés.",
    ],
    recall: {
      title: "¿Te acordás de repartir?",
      text: "Una fracción es eso: repartir algo en partes iguales y quedarte con algunas. Se parte el 'todo' en pedazos iguales y contás cuántos tomás.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\dfrac{1}{2} + \\dfrac{1}{3}",
    steps: [
      {
        latex: "\\text{m.c.m.}(2, 3) = 6",
        note: "Buscamos un denominador común usando el m.c.m. de 2 y 3.",
        plain: "El m.c.m. es el número más chico donde 'entran justo' el 2 y el 3: es 6. Cortamos todo en sextos.",
      },
      {
        latex: "\\dfrac{1}{2} + \\dfrac{1}{3} = \\dfrac{3}{6} + \\dfrac{2}{6}",
        note: "Convertimos ambas al denominador 6.",
        plain: "1/2 es lo mismo que 3/6, y 1/3 es lo mismo que 2/6. Ahora las dos están cortadas en sextos.",
      },
      {
        latex: "= \\dfrac{5}{6}",
        note: "Sumamos los numeradores. Ya está en mínima expresión.",
        plain: "Con el mismo denominador, sumamos solo los de arriba: 3 + 2 = 5. Quedan 5 pedazos de 6.",
      },
    ],
  },
  materials: ["papel y lápiz"],
  glossary: [
    { term: "fracción", plain: "Un pedazo de algo entero. Si partís una pizza en 4 y agarrás 1, comés 1/4 (un cuarto) de la pizza." },
    { term: "numerador", plain: "El número de arriba de la fracción. Dice cuántos pedazos tomás. En 3/4, el numerador es 3." },
    { term: "denominador común", plain: "Cuando dos fracciones tienen el mismo número abajo. Recién ahí se pueden sumar o restar." },
    { term: "denominador", plain: "El número de abajo de la fracción. Dice en cuántos pedazos iguales partiste el entero. En 3/4, el denominador es 4." },
    { term: "equivalentes", plain: "Dos fracciones que valen lo mismo aunque se escriban distinto. 1/2 y 2/4 son la misma cantidad de pizza." },
    { term: "m.c.m.", plain: "Mínimo común múltiplo: el número más chico en el que 'entran justo' los dos denominadores. Para 2 y 3 es 6." },
    { term: "mínima expresión", plain: "La fracción escrita lo más simple posible, sin poder achicarla más. 2/4 en mínima expresión es 1/2." },
  ],
};
