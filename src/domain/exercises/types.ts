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
