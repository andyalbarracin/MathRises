import type { ModuleId } from "@/domain/types";
import { FRACCIONES_CONCEPT_ID } from "./fractions";

export interface RoadmapNode {
  conceptId: string;
  title: string;
  targetWeek: number;
  /** Si tiene contenido jugable en esta versión. */
  playable: boolean;
}

export interface RoadmapSection {
  module: ModuleId;
  title: string;
  nodes: RoadmapNode[];
}

/**
 * Estructura del roadmap. En esta versión solo el nodo de fracciones es jugable;
 * el resto muestra el recorrido completo hacia febrero 2027.
 */
export const ROADMAP: RoadmapSection[] = [
  {
    module: "FUNDAMENTOS",
    title: "Fundamentos",
    nodes: [
      { conceptId: "enteros-signos", title: "Enteros y signos", targetWeek: 1, playable: false },
      { conceptId: "orden-operaciones", title: "Orden de operaciones", targetWeek: 1, playable: false },
      { conceptId: FRACCIONES_CONCEPT_ID, title: "Fracciones", targetWeek: 1, playable: true },
      { conceptId: "potencias-radicales", title: "Potencias y radicales", targetWeek: 2, playable: false },
      { conceptId: "porcentajes-proporciones", title: "Porcentajes y proporciones", targetWeek: 2, playable: false },
    ],
  },
  {
    module: "ALGEBRA",
    title: "Álgebra",
    nodes: [
      { conceptId: "expresiones-algebraicas", title: "Expresiones algebraicas", targetWeek: 3, playable: false },
      { conceptId: "polinomios", title: "Polinomios y productos notables", targetWeek: 4, playable: false },
      { conceptId: "factorizacion", title: "Factorización", targetWeek: 5, playable: false },
    ],
  },
  {
    module: "ECUACIONES",
    title: "Ecuaciones",
    nodes: [
      { conceptId: "ecuaciones-lineales", title: "Ecuaciones lineales", targetWeek: 7, playable: false },
      { conceptId: "ecuaciones-cuadraticas", title: "Ecuaciones cuadráticas", targetWeek: 8, playable: false },
      { conceptId: "inecuaciones", title: "Inecuaciones e intervalos", targetWeek: 10, playable: false },
    ],
  },
  {
    module: "FUNCIONES",
    title: "Funciones",
    nodes: [
      { conceptId: "concepto-funcion", title: "Concepto de función", targetWeek: 12, playable: false },
      { conceptId: "funciones-lineales", title: "Funciones lineales", targetWeek: 13, playable: false },
      { conceptId: "funciones-cuadraticas", title: "Funciones cuadráticas", targetWeek: 15, playable: false },
    ],
  },
  {
    module: "TRIGONOMETRIA",
    title: "Trigonometría",
    nodes: [
      { conceptId: "trig-i", title: "Trigonometría I", targetWeek: 18, playable: false },
      { conceptId: "trig-ii", title: "Trigonometría II", targetWeek: 19, playable: false },
    ],
  },
  {
    module: "SIMULACROS",
    title: "Simulacros",
    nodes: [
      { conceptId: "simulacros-i", title: "Simulacros I", targetWeek: 23, playable: false },
      { conceptId: "simulacros-ii", title: "Simulacros II", targetWeek: 24, playable: false },
    ],
  },
];

export const TARGET_DATE = "2027-02-01";
