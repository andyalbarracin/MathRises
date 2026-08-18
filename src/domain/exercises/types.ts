import type { CardType, Difficulty, ErrorCategory } from "@/domain/types";
import type { ValidationResult } from "@/domain/validation";
import type { Rng } from "@/lib/rng";

export interface SolutionStep {
  latex: string;
  note: string;
}

export interface ExerciseOption {
  id: string;
  latex?: string;
  text?: string;
}

/** Descripción de un diagrama geométrico (datos puros; el render es SVG). */
export type DiagramSpec =
  | { kind: "right-triangle"; legA: number; legB: number; labelA: string; labelB: string; labelC: string; markAngle?: boolean }
  | { kind: "triangle-angles"; a: string; b: string; c: string }
  | { kind: "rectangle"; w: number; h: number; labelW: string; labelH: string }
  | { kind: "circle"; labelR: string }
  | { kind: "coord-point"; x: number; y: number; label?: string }
  | { kind: "similar-triangles"; small: [string, string]; large: [string, string] };

/** Una instancia concreta de ejercicio, lista para renderizar y corregir. */
export interface GeneratedExercise {
  id: string;
  conceptId: string;
  templateId: string;
  cardType: CardType;
  difficulty: Difficulty;
  /** Consigna en español. */
  instruction: string;
  /** Enunciado en LaTeX (para KaTeX). Vacío si no aplica. */
  promptLatex: string;
  /** Enunciado accesible en texto plano. */
  promptText: string;
  /** Opciones para MULTIPLE_CHOICE / ERROR_SPOTTING. */
  options?: ExerciseOption[];
  /** Respuesta correcta legible (para el feedback / paso a paso). */
  correctAnswerDisplay: string;
  /** Diagrama geométrico opcional (se renderiza en vez del enunciado LaTeX). */
  diagram?: DiagramSpec;
  /** Valida la respuesta del usuario (tolerante a formato). */
  validate(answer: string): ValidationResult;
  /** Clasifica el tipo de error a partir de la respuesta incorrecta. */
  classifyError(answer: string): ErrorCategory[];
  /** Pistas progresivas: [conceptual, primer paso, casi-completa]. */
  hints: [string, string, string];
  /** Solución paso a paso. */
  steps: SolutionStep[];
}

export interface ExerciseTemplate {
  id: string;
  conceptId: string;
  cardType: CardType;
  difficulty: Difficulty;
  /** Genera una instancia determinista a partir del RNG sembrado. */
  generate(rng: Rng, index: number): GeneratedExercise;
}
