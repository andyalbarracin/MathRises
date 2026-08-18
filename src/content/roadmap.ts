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
 * Estructura completa del roadmap (ago 2026 → feb 2027), alineada con el plan
 * de estudio. Los nodos jugables tienen contenido; el resto marca el recorrido.
 */
export const ROADMAP: RoadmapSection[] = [
  {
    module: "FUNDAMENTOS",
    title: "Fundamentos",
    nodes: [
      { conceptId: "enteros-signos", title: "Enteros y signos", targetWeek: 1, playable: true },
      { conceptId: "orden-operaciones", title: "Orden de operaciones", targetWeek: 1, playable: true },
      { conceptId: FRACCIONES_CONCEPT_ID, title: "Fracciones", targetWeek: 1, playable: true },
      { conceptId: "potencias-radicales", title: "Potencias y radicales", targetWeek: 2, playable: true },
      { conceptId: "porcentajes-proporciones", title: "Porcentajes y proporciones", targetWeek: 2, playable: true },
    ],
  },
  {
    module: "ALGEBRA",
    title: "Álgebra",
    nodes: [
      { conceptId: "expresiones-algebraicas", title: "Expresiones algebraicas", targetWeek: 3, playable: true },
      { conceptId: "polinomios", title: "Operaciones con polinomios", targetWeek: 4, playable: true },
      { conceptId: "factorizacion-1", title: "Factorización I", targetWeek: 5, playable: true },
      { conceptId: "factorizacion-2", title: "Factorización II y racionales", targetWeek: 6, playable: false },
    ],
  },
  {
    module: "ECUACIONES",
    title: "Ecuaciones",
    nodes: [
      { conceptId: "ecuaciones-lineales", title: "Ecuaciones lineales", targetWeek: 7, playable: true },
      { conceptId: "ecuaciones-cuadraticas", title: "Cuadráticas y valor absoluto", targetWeek: 8, playable: true },
      { conceptId: "ecuaciones-racionales", title: "Ecuaciones racionales", targetWeek: 9, playable: false },
      { conceptId: "inecuaciones", title: "Inecuaciones e intervalos", targetWeek: 10, playable: true },
    ],
  },
  {
    module: "GEOMETRIA_I",
    title: "Geometría I",
    nodes: [
      { conceptId: "geometria-base", title: "Geometría base", targetWeek: 11, playable: false },
    ],
  },
  {
    module: "FUNCIONES",
    title: "Funciones",
    nodes: [
      { conceptId: "concepto-funcion", title: "Concepto de función", targetWeek: 12, playable: false },
      { conceptId: "funciones-lineales", title: "Función lineal y rectas", targetWeek: 13, playable: false },
      { conceptId: "sistemas-ecuaciones", title: "Sistemas de ecuaciones", targetWeek: 14, playable: false },
      { conceptId: "funciones-cuadraticas", title: "Función cuadrática", targetWeek: 15, playable: false },
    ],
  },
  {
    module: "GEOMETRIA_II",
    title: "Geometría II",
    nodes: [
      { conceptId: "geometria-plana", title: "Geometría plana avanzada", targetWeek: 16, playable: false },
      { conceptId: "semejanza-transformaciones", title: "Semejanza y transformaciones", targetWeek: 17, playable: false },
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
    module: "EXP_LOG",
    title: "Exponenciales y logaritmos",
    nodes: [
      { conceptId: "exp-log", title: "Exponenciales y logaritmos", targetWeek: 20, playable: false },
    ],
  },
  {
    module: "COMPLEJOS",
    title: "Números complejos",
    nodes: [
      { conceptId: "complejos", title: "Números complejos + repaso", targetWeek: 21, playable: false },
    ],
  },
  {
    module: "INTEGRACION",
    title: "Integración",
    nodes: [
      { conceptId: "repaso-integral", title: "Repaso integral", targetWeek: 22, playable: false },
    ],
  },
  {
    module: "SIMULACROS",
    title: "Simulacros",
    nodes: [
      { conceptId: "simulacros-i", title: "Simulacros I", targetWeek: 23, playable: false },
      { conceptId: "simulacros-ii", title: "Simulacros II y cierre", targetWeek: 24, playable: false },
    ],
  },
];

export const TARGET_DATE = "2027-02-01";
