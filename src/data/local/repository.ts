import type {
  Attempt,
  ConceptMastery,
  DailySession,
  DiagnosticSummary,
  ErrorRecord,
  Profile,
  ReviewSchedule,
  UserProgress,
} from "@/domain/types";
import type { RepositoryInterface } from "../repository";
import { getDB, type ProgressRow } from "./db";

const PROGRESS_ID = "me";

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  weeklyGoalMinutes: 120,
  weeklyProgressMinutes: 0,
  onboardingComplete: false,
};

export class LocalRepository implements RepositoryInterface {
  async getProfile(): Promise<Profile | undefined> {
    return getDB().profile.get("me");
  }

  async saveProfile(profile: Profile): Promise<void> {
    await getDB().profile.put(profile);
  }

  async getProgress(): Promise<UserProgress> {
    const row = await getDB().progress.get(PROGRESS_ID);
    if (!row) return { ...DEFAULT_PROGRESS };
    const { id: _id, ...rest } = row;
    void _id;
    return { ...DEFAULT_PROGRESS, ...rest };
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    const row: ProgressRow = { id: PROGRESS_ID, ...progress };
    await getDB().progress.put(row);
  }

  async getMastery(conceptId: string): Promise<ConceptMastery | undefined> {
    return getDB().masteries.get(conceptId);
  }

  async getAllMasteries(): Promise<ConceptMastery[]> {
    return getDB().masteries.toArray();
  }

  async upsertMastery(m: ConceptMastery): Promise<void> {
    await getDB().masteries.put(m);
  }

  async bulkUpsertMastery(ms: ConceptMastery[]): Promise<void> {
    if (ms.length) await getDB().masteries.bulkPut(ms);
  }

  async getDiagnostic(): Promise<DiagnosticSummary | undefined> {
    return getDB().diagnostic.get("me");
  }

  async saveDiagnostic(s: DiagnosticSummary): Promise<void> {
    await getDB().diagnostic.put(s);
  }

  async getReview(conceptId: string): Promise<ReviewSchedule | undefined> {
    return getDB().reviews.get(conceptId);
  }

  async getAllReviews(): Promise<ReviewSchedule[]> {
    return getDB().reviews.toArray();
  }

  async upsertReview(r: ReviewSchedule): Promise<void> {
    await getDB().reviews.put(r);
  }

  async getErrors(): Promise<ErrorRecord[]> {
    const all = await getDB().errors.toArray();
    return all.sort((a, b) => b.lastOccurrence - a.lastOccurrence);
  }

  /**
   * Registra un error agregando por (concepto + categoría principal):
   * si ya existe, incrementa el contador y actualiza la última aparición.
   */
  async recordError(
    input: Omit<ErrorRecord, "id" | "firstOccurrence" | "lastOccurrence" | "count" | "resolved">,
  ): Promise<void> {
    const db = getDB();
    const now = Date.now();
    const primary = input.categories[0] ?? "UNKNOWN";
    const id = `${input.conceptId}::${primary}`;

    const existing = await db.errors.get(id);
    if (existing) {
      await db.errors.put({
        ...existing,
        prompt: input.prompt,
        userAnswer: input.userAnswer,
        correctAnswer: input.correctAnswer,
        explanation: input.explanation,
        categories: input.categories,
        lastOccurrence: now,
        count: existing.count + 1,
        resolved: false,
        nextReviewAt: input.nextReviewAt,
      });
    } else {
      await db.errors.put({
        id,
        ...input,
        firstOccurrence: now,
        lastOccurrence: now,
        count: 1,
        resolved: false,
      });
    }
  }

  async createSession(s: DailySession): Promise<void> {
    await getDB().sessions.put(s);
  }

  async completeSession(s: DailySession): Promise<void> {
    await getDB().sessions.put(s);
  }

  async appendAttempt(a: Attempt): Promise<void> {
    await getDB().attempts.put(a);
  }

  async getRecentSessions(limit: number): Promise<DailySession[]> {
    return getDB().sessions.orderBy("date").reverse().limit(limit).toArray();
  }
}

/** Singleton del repositorio local (usar solo en el cliente). */
export const repository: RepositoryInterface = new LocalRepository();
