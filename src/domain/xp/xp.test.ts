import { describe, it, expect } from "vitest";
import {
  xpForAttempt,
  sessionBonus,
  levelForXp,
  levelName,
  levelProgress,
  updateStreak,
} from "./index";
import type { UserProgress } from "@/domain/types";

describe("xpForAttempt", () => {
  it("da XP por dificultad y 0 si es incorrecto", () => {
    expect(xpForAttempt({ difficulty: "easy", correct: true, hintsUsed: 0 })).toBe(5);
    expect(xpForAttempt({ difficulty: "challenge", correct: true, hintsUsed: 0 })).toBe(25);
    expect(xpForAttempt({ difficulty: "hard", correct: false, hintsUsed: 0 })).toBe(0);
  });

  it("las pistas reducen levemente pero nunca por debajo de 1", () => {
    expect(xpForAttempt({ difficulty: "medium", correct: true, hintsUsed: 2 })).toBeLessThan(10);
    expect(xpForAttempt({ difficulty: "easy", correct: true, hintsUsed: 3 })).toBeGreaterThanOrEqual(1);
  });
});

describe("niveles", () => {
  it("mapea XP a nivel y nombre", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelName(1)).toBe("Reinicio");
    expect(levelForXp(300)).toBe(3);
    expect(levelProgress(0).pct).toBe(0);
  });
});

describe("sessionBonus", () => {
  it("suma bonus por sesión perfecta y sin pistas", () => {
    expect(sessionBonus({ perfect: true, noHints: true, weeklyGoalMet: false })).toBe(25);
    expect(sessionBonus({ perfect: false, noHints: false, weeklyGoalMet: false })).toBe(0);
  });
});

describe("updateStreak", () => {
  const base: UserProgress = {
    xp: 0,
    level: 1,
    streak: 3,
    lastActiveDate: "2026-08-16",
    weeklyGoalMinutes: 120,
    weeklyProgressMinutes: 0,
    onboardingComplete: true,
  };

  it("incrementa en días consecutivos", () => {
    expect(updateStreak(base, "2026-08-17").streak).toBe(4);
  });

  it("no cuenta dos veces el mismo día", () => {
    expect(updateStreak(base, "2026-08-16").streak).toBe(3);
  });

  it("resetea a 1 si se saltó un día", () => {
    expect(updateStreak(base, "2026-08-18").streak).toBe(1);
  });
});
