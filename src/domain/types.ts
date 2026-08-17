/**
 * Tipos del dominio de RiseMath.
 * Lógica pura: sin dependencias de React, Dexie ni IO.
 */

export type Difficulty = "easy" | "medium" | "hard" | "challenge";

export const DIFFICULTY_XP: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 15,
  challenge: 25,
};

/** Tipos de tarjeta de aprendizaje (ver .docs/temas.md). */
export type CardType =
  | "EXPLANATION_CARD"
  | "FORMULA_CARD"
  | "WORKED_EXAMPLE"
  | "MULTIPLE_CHOICE"
  | "MULTI_SELECT"
  | "NUMERIC_INPUT"
  | "ALGEBRA_INPUT"
  | "STEP_ORDER"
  | "MATCH_PAIRS"
  | "TRUE_FALSE"
  | "ERROR_SPOTTING"
  | "MISSING_STEP"
  | "GRAPH_INTERPRETATION"
  | "COORDINATE_POINT"
  | "GEOMETRY_DIAGRAM"
  | "WORD_PROBLEM"
  | "DOMAIN_CHECK"
  | "INTERVAL_INPUT"
  | "MIXED_CHALLENGE"
  | "SELF_EXPLAIN";

/** Taxonomía de errores (ver .docs/conceptos.md). */
export type ErrorCategory =
  | "SIGN_ERROR"
  | "FRACTION_COMMON_DENOMINATOR"
  | "FRACTION_NOT_SIMPLIFIED"
  | "ORDER_OF_OPERATIONS"
  | "DISTRIBUTIVE_PROPERTY"
  | "EXPONENT_RULE"
  | "RADICAL_SIMPLIFICATION"
  | "FACTOR_COMMON"
  | "FACTORING_PATTERN"
  | "QUADRATIC_FORMULA"
  | "DOMAIN_RESTRICTION"
  | "INVALID_SOLUTION"
  | "INEQUALITY_SIGN_FLIP"
  | "INTERVAL_NOTATION"
  | "SLOPE_ERROR"
  | "PARALLEL_PERPENDICULAR"
  | "FUNCTION_DOMAIN"
  | "SYSTEM_SUBSTITUTION"
  | "SYSTEM_ELIMINATION"
  | "VERTEX_ERROR"
  | "LOG_DOMAIN"
  | "LOG_PROPERTY"
  | "TRIG_RATIO"
  | "DEGREE_RADIAN"
  | "SINE_COSINE_LAW"
  | "GEOMETRY_DIAGRAM"
  | "UNIT_CONVERSION"
  | "SCIENTIFIC_NOTATION"
  | "COMPLEX_NUMBER_SIGN"
  | "ARITHMETIC_SLIP"
  | "UNKNOWN";

/** Etiquetas en español para el Error Log. */
export const ERROR_LABELS: Partial<Record<ErrorCategory, string>> = {
  SIGN_ERROR: "Signos",
  FRACTION_COMMON_DENOMINATOR: "Denominador común",
  FRACTION_NOT_SIMPLIFIED: "Fracción sin simplificar",
  ORDER_OF_OPERATIONS: "Orden de operaciones",
  ARITHMETIC_SLIP: "Error de cálculo",
  UNKNOWN: "Otro",
};

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** Módulos del roadmap. */
export type ModuleId =
  | "FUNDAMENTOS"
  | "ALGEBRA"
  | "ECUACIONES"
  | "GEOMETRIA_I"
  | "FUNCIONES"
  | "GEOMETRIA_II"
  | "TRIGONOMETRIA"
  | "EXP_LOG"
  | "COMPLEJOS"
  | "INTEGRACION"
  | "SIMULACROS";

export interface Concept {
  id: string;
  slug: string;
  title: string;
  description: string;
  module: ModuleId;
  prerequisites: string[];
  difficulty: Difficulty;
  targetWeek: number;
  masteryRequired: MasteryLevel;
  tags: string[];
}

export interface ConceptMastery {
  conceptId: string;
  level: MasteryLevel;
  attempts: number;
  correct: number;
  /** Tipos de card resueltos correctamente. */
  seenTypes: CardType[];
  /** Ids de sesión con al menos un acierto. */
  sessionsSeen: string[];
  /** Si aprobó al menos un repaso diferido. */
  lastDelayedReviewPassed: boolean;
  updatedAt: number;
}

export type ReviewResult = "ok" | "fail";

export interface ReviewSchedule {
  conceptId: string;
  nextReviewAt: number;
  reviewInterval: number; // días
  easeFactor: number;
  reviewCount: number;
  lastResult: ReviewResult | null;
}

export interface ErrorRecord {
  id: string;
  conceptId: string;
  exerciseId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  categories: ErrorCategory[];
  explanation: string;
  firstOccurrence: number;
  lastOccurrence: number;
  count: number;
  resolved: boolean;
  nextReviewAt: number | null;
}

export interface Attempt {
  id: string;
  sessionId: string;
  conceptId: string;
  exerciseId: string;
  cardType: CardType;
  userAnswer: string;
  correct: boolean;
  hintsUsed: number;
  responseMs: number;
  categories: ErrorCategory[];
  createdAt: number;
}

export type SessionMode = "QUICK" | "STANDARD" | "DEEP";

export interface DailySession {
  id: string;
  date: string; // YYYY-MM-DD
  mode: SessionMode;
  conceptId: string;
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  durationMs: number;
  completedAt: number | null;
}

export interface Profile {
  id: string;
  name: string;
  targetDate: string; // ISO
  weeklyHours: number;
  studyDays: number[]; // 0=domingo … 6=sábado
  createdAt: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  weeklyGoalMinutes: number;
  weeklyProgressMinutes: number;
  onboardingComplete: boolean;
}

/** Resumen serializable del diagnóstico inicial (para persistir y mostrar). */
export interface DiagnosticAreaResult {
  area: string;
  label: string;
  correct: number;
  total: number;
}

export interface DiagnosticSummary {
  id: string;
  results: DiagnosticAreaResult[];
  completedAt: number;
}
