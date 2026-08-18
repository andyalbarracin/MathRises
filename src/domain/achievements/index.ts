/** Logros: se calculan a partir de las estadísticas del alumno (puro). */

export interface AchievementStats {
  xp: number;
  level: number;
  streak: number;
  sessions: number;
  exercises: number;
  accuracy: number; // 0–1
  conceptsMastered: number;
  studyMinutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earned: (s: AchievementStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-session", title: "Primer paso", description: "Completá tu primera sesión", emoji: "🐾", earned: (s) => s.sessions >= 1 },
  { id: "streak-3", title: "En marcha", description: "Racha de 3 días", emoji: "🔥", earned: (s) => s.streak >= 3 },
  { id: "streak-7", title: "Semana completa", description: "Racha de 7 días", emoji: "⚡", earned: (s) => s.streak >= 7 },
  { id: "xp-100", title: "Cien puntos", description: "Alcanzá 100 XP", emoji: "💯", earned: (s) => s.xp >= 100 },
  { id: "xp-500", title: "Media milla", description: "Alcanzá 500 XP", emoji: "🚀", earned: (s) => s.xp >= 500 },
  { id: "exercises-50", title: "Constancia", description: "Resolvé 50 ejercicios", emoji: "🧮", earned: (s) => s.exercises >= 50 },
  { id: "accuracy-90", title: "Puntería", description: "90% de aciertos (con 15+ ejercicios)", emoji: "🎯", earned: (s) => s.accuracy >= 0.9 && s.exercises >= 15 },
  { id: "concept-mastered", title: "Primer dominio", description: "Dominá un tema", emoji: "⭐", earned: (s) => s.conceptsMastered >= 1 },
  { id: "fundamentos", title: "Cimientos firmes", description: "Dominá 3 temas", emoji: "🏗️", earned: (s) => s.conceptsMastered >= 3 },
  { id: "level-3", title: "Aprendiz de Álgebra", description: "Llegá al nivel 3", emoji: "🎓", earned: (s) => s.level >= 3 },
];

export function computeAchievements(stats: AchievementStats): {
  achievement: Achievement;
  earned: boolean;
}[] {
  return ACHIEVEMENTS.map((a) => ({ achievement: a, earned: a.earned(stats) }));
}
