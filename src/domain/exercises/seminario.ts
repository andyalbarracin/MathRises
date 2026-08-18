import { validateChoice } from "@/domain/validation";
import type { ErrorCategory } from "@/domain/types";
import type { Rng } from "@/lib/rng";
import { buildChoices } from "./mc";
import type { ExerciseTemplate, GeneratedExercise } from "./types";

const CONCEPT_ID = "seminario";

interface Question {
  q: string;
  options: string[];
  correct: number;
}
interface Passage {
  text: string;
  comprehension: Question;
  mainIdea: Question;
}

/** Textos originales (temática industria/operaciones), escritos para la app. */
const PASSAGES: Passage[] = [
  {
    text:
      "Una fábrica organiza su producción en turnos para aprovechar al máximo sus máquinas. Cuando la demanda aumenta, suma un turno nocturno; cuando baja, concentra el trabajo en el día. Así evita que las máquinas queden paradas y reduce el costo de cada unidad producida.",
    comprehension: {
      q: "Según el texto, ¿qué hace la fábrica cuando la demanda aumenta?",
      options: ["Suma un turno nocturno", "Detiene las máquinas", "Reduce el personal", "Baja los precios"],
      correct: 0,
    },
    mainIdea: {
      q: "¿Cuál es la idea principal del texto?",
      options: [
        "La fábrica ajusta sus turnos según la demanda para no dejar máquinas paradas",
        "Las fábricas siempre trabajan de noche",
        "La demanda de productos nunca cambia",
        "El costo no depende de cuánto se produce",
      ],
      correct: 0,
    },
  },
  {
    text:
      "Los paneles solares transforman la luz del sol en electricidad. Su rendimiento depende de cuánta luz reciben, por eso producen más en verano y menos en invierno. Para aprovecharlos mejor, se los orienta hacia el lado donde el sol pega más horas al día.",
    comprehension: {
      q: "¿De qué depende el rendimiento de los paneles solares?",
      options: ["De cuánta luz reciben", "Del precio de la electricidad", "De la temperatura del agua", "Del tamaño de la fábrica"],
      correct: 0,
    },
    mainIdea: {
      q: "¿Cuál es la idea principal del texto?",
      options: [
        "El rendimiento de los paneles depende de la luz, por eso se los orienta hacia el sol",
        "Los paneles solo funcionan en verano",
        "La electricidad es siempre cara",
        "El sol pega igual todo el año",
      ],
      correct: 0,
    },
  },
  {
    text:
      "En un depósito, ubicar los productos más pedidos cerca de la salida ahorra tiempo. Los operarios recorren menos distancia y despachan más rápido. Lo que casi no se pide se guarda en el fondo, donde ocupa un lugar que no molesta.",
    comprehension: {
      q: "¿Dónde conviene ubicar los productos más pedidos?",
      options: ["Cerca de la salida", "En el fondo del depósito", "Fuera del depósito", "Junto a los que no se piden"],
      correct: 0,
    },
    mainIdea: {
      q: "¿Cuál es la idea principal del texto?",
      options: [
        "Ordenar el depósito según cuánto se pide cada producto agiliza el despacho",
        "Todos los productos deben estar en el fondo",
        "Los operarios no influyen en la rapidez",
        "El orden del depósito no importa",
      ],
      correct: 0,
    },
  },
  {
    text:
      "El mantenimiento preventivo consiste en revisar las máquinas antes de que fallen. Cuesta tiempo y dinero, pero evita las paradas inesperadas, que suelen ser mucho más caras. Una máquina que se detiene sin aviso puede frenar toda la línea de producción.",
    comprehension: {
      q: "¿En qué consiste el mantenimiento preventivo?",
      options: ["Revisar las máquinas antes de que fallen", "Reparar solo cuando algo se rompe", "Comprar máquinas nuevas", "Apagar la línea de producción"],
      correct: 0,
    },
    mainIdea: {
      q: "¿Cuál es la idea principal del texto?",
      options: [
        "El mantenimiento preventivo cuesta, pero evita paradas inesperadas más caras",
        "Las máquinas nunca se detienen",
        "Conviene esperar a que las máquinas fallen",
        "El mantenimiento no tiene costo",
      ],
      correct: 0,
    },
  },
];

/** Oraciones para completar con el conector adecuado. */
const CONNECTORS: { sentence: string; options: string[]; correct: number }[] = [
  {
    sentence: "Estudió con constancia toda la semana; ______, aprobó el examen sin problemas.",
    options: ["por lo tanto", "sin embargo", "aunque", "es decir"],
    correct: 0,
  },
  {
    sentence: "Quería terminar el proyecto ese día, ______ el material no llegó a tiempo.",
    options: ["sin embargo", "por eso", "además", "o sea"],
    correct: 0,
  },
  {
    sentence: "No asistió a la reunión; ______, tampoco envió el informe que le pidieron.",
    options: ["además", "en cambio", "porque", "aunque"],
    correct: 0,
  },
  {
    sentence: "El plan de trabajo es simple, ______ muy efectivo para lo que se necesita.",
    options: ["pero", "porque", "entonces", "o sea"],
    correct: 0,
  },
  {
    sentence: "Llovió durante toda la noche; ______, el nivel del río creció varios centímetros.",
    options: ["por lo tanto", "sin embargo", "aunque", "es decir"],
    correct: 0,
  },
  {
    sentence: "Trabaja hace años en finanzas; ______, conoce muy bien cómo se calculan los costos.",
    options: ["por eso", "pero", "aunque", "sin embargo"],
    correct: 0,
  },
];

/* SEM_COMPREHENSION — comprensión de un texto ---------------------------- */
export const semComprehensionTemplate: ExerciseTemplate = {
  id: "SEM_COMPREHENSION",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const p = rng.pick(PASSAGES);
    const { options, correctId, correctText } = buildChoices(
      rng,
      p.comprehension.options.map((text, i) => ({ text, correct: i === p.comprehension.correct })),
    );
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: p.comprehension.q,
      promptLatex: "",
      promptText: "comprensión lectora",
      passage: p.text,
      correctAnswerDisplay: correctText,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["UNKNOWN"],
      hints: [
        "Volvé al texto y buscá la parte que responde exactamente lo que se pregunta.",
        "No te dejes llevar por lo que suena razonable: fijate qué dice el texto.",
        `La respuesta está en el texto: ${correctText}.`,
      ],
      steps: [{ latex: `\\text{Ver el texto}`, note: `Respuesta: ${correctText}.` }],
    };
  },
};

/* SEM_MAIN_IDEA — idea principal ----------------------------------------- */
export const semMainIdeaTemplate: ExerciseTemplate = {
  id: "SEM_MAIN_IDEA",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "hard",
  generate(rng: Rng, index: number): GeneratedExercise {
    const p = rng.pick(PASSAGES);
    const { options, correctId, correctText } = buildChoices(
      rng,
      p.mainIdea.options.map((text, i) => ({ text, correct: i === p.mainIdea.correct })),
    );
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "hard",
      instruction: "¿Cuál es la idea principal del texto?",
      promptLatex: "",
      promptText: "idea principal",
      passage: p.text,
      correctAnswerDisplay: correctText,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["UNKNOWN"],
      hints: [
        "La idea principal resume todo el texto en una oración; no es un detalle suelto.",
        "Descartá las opciones demasiado generales o que contradicen el texto.",
        `La idea principal es: ${correctText}.`,
      ],
      steps: [{ latex: `\\text{Idea principal}`, note: correctText }],
    };
  },
};

/* SEM_CONNECTOR — elegir el conector ------------------------------------- */
export const semConnectorTemplate: ExerciseTemplate = {
  id: "SEM_CONNECTOR",
  conceptId: CONCEPT_ID,
  cardType: "MULTIPLE_CHOICE",
  difficulty: "medium",
  generate(rng: Rng, index: number): GeneratedExercise {
    const c = rng.pick(CONNECTORS);
    const { options, correctId, correctText } = buildChoices(
      rng,
      c.options.map((text, i) => ({ text, correct: i === c.correct })),
    );
    return {
      id: `${this.id}-${index}`,
      conceptId: CONCEPT_ID,
      templateId: this.id,
      cardType: "MULTIPLE_CHOICE",
      difficulty: "medium",
      instruction: "Elegí el conector que completa la oración.",
      promptLatex: "",
      promptText: "conectores",
      passage: c.sentence,
      correctAnswerDisplay: correctText,
      options,
      validate: (ans) => validateChoice(ans, correctId),
      classifyError: (): ErrorCategory[] => ["UNKNOWN"],
      hints: [
        "Pensá qué relación hay entre las dos partes: ¿consecuencia, oposición, suma o causa?",
        "Consecuencia: por lo tanto / por eso. Oposición: sin embargo / pero. Suma: además.",
        `El conector correcto es: ${correctText}.`,
      ],
      steps: [{ latex: `\\text{Conector}`, note: `Correcto: ${correctText}.` }],
    };
  },
};

export const seminarioTemplates: ExerciseTemplate[] = [
  semComprehensionTemplate,
  semMainIdeaTemplate,
  semConnectorTemplate,
];
