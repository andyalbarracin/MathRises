import { DIFFICULTY_XP, type Difficulty, type UserProgress } from "@/domain/types";

export interface XpInput {
  difficulty: Difficulty;
  correct: boolean;
  hintsUsed: number;
}

/**
 * XP de un ejercicio. Las pistas reducen levemente; no se premia la velocidad.
 * Un error no suma XP pero tampoco resta.
 */
export function xpForAttempt({ difficulty, correct, hintsUsed }: XpInput): number {
  if (!correct) return 0;
  const base = DIFFICULTY_XP[difficulty];
  const penalty = Math.min(hintsUsed, 3) * 0.15; // hasta -45%
  return Math.max(1, Math.round(base * (1 - penalty)));
}

/** Bonus de fin de sesión. */
export function sessionBonus(opts: {
  perfect: boolean; // sin errores
  noHints: boolean;
  weeklyGoalMet: boolean;
}): number {
  let bonus = 0;
  if (opts.perfect) bonus += 15;
  if (opts.noHints) bonus += 10;
  if (opts.weeklyGoalMet) bonus += 20;
  return bonus;
}

/** Umbrales acumulados de XP por nivel (índice = nivel - 1). */
const LEVEL_THRESHOLDS = [
  0, 120, 300, 560, 900, 1350, 1900, 2600, 3500, 4600,
];

export const LEVEL_NAMES = [
  "Reinicio",
  "Cimientos",
  "Aprendiz de Álgebra",
  "Resolutor de Ecuaciones",
  "Analista de Funciones",
  "Navegante de Geometría",
  "Operador de Trigonometría",
  "Constructor de Precálculo",
  "Candidato al Ingreso",
  "Listo para Ingeniería",
];

export function levelForXp(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

export function levelName(level: number): string {
  return LEVEL_NAMES[Math.max(0, Math.min(LEVEL_NAMES.length - 1, level - 1))];
}

/** Progreso hacia el siguiente nivel (0–1) y XP restante. */
export function levelProgress(xp: number): { pct: number; toNext: number } {
  const level = levelForXp(xp);
  const curr = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level] ?? curr + 1000;
  const pct = Math.min(1, (xp - curr) / (next - curr));
  return { pct, toNext: Math.max(0, next - xp) };
}

/**
 * Actualiza la racha según la fecha de la última actividad.
 * `today` y `lastActiveDate` en formato YYYY-MM-DD.
 */
export function updateStreak(
  progress: UserProgress,
  today: string,
): UserProgress {
  if (progress.lastActiveDate === today) return progress; // ya contada hoy

  const streak = isConsecutiveDay(progress.lastActiveDate, today)
    ? progress.streak + 1
    : 1;

  return { ...progress, streak, lastActiveDate: today };
}

function isConsecutiveDay(prev: string | null, today: string): boolean {
  if (!prev) return false;
  const prevMs = Date.parse(prev + "T00:00:00");
  const todayMs = Date.parse(today + "T00:00:00");
  return todayMs - prevMs === 86_400_000;
}
