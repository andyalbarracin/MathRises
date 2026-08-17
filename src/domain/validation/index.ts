import {
  parseFraction,
  fractionsEqual,
  isReduced,
  type Fraction,
} from "@/domain/math/fraction";

export interface ValidationResult {
  correct: boolean;
  /** Motivo legible cuando es incorrecto (para el feedback). */
  detail?: string;
}

/** Compara un número con tolerancia configurable. */
export function validateNumeric(
  raw: string,
  expected: number,
  tolerance = 1e-9,
): ValidationResult {
  const value = Number(raw.trim().replace(",", "."));
  if (Number.isNaN(value)) return { correct: false, detail: "No es un número válido." };
  return { correct: Math.abs(value - expected) <= tolerance };
}

/**
 * Valida una fracción por equivalencia matemática (no por formato).
 * Si `requireReduced` es true, exige además que esté simplificada.
 */
export function validateFraction(
  raw: string,
  expected: Fraction,
  requireReduced = false,
): ValidationResult {
  const parsed = parseFraction(raw);
  if (!parsed) return { correct: false, detail: "No se pudo interpretar la fracción." };
  if (!fractionsEqual(parsed, expected)) return { correct: false };
  if (requireReduced && !isReduced(parsed)) {
    return { correct: false, detail: "Es equivalente, pero falta simplificarla." };
  }
  return { correct: true };
}

/** Valida elección exacta (multiple choice) por id de opción. */
export function validateChoice(selectedId: string, correctId: string): ValidationResult {
  return { correct: selectedId === correctId };
}
