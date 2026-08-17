import type {
  Attempt,
  ConceptMastery,
  DailySession,
  ErrorRecord,
  Profile,
  ReviewSchedule,
  UserProgress,
} from "@/domain/types";

/**
 * Contrato de persistencia. La implementación local usa Dexie/IndexedDB;
 * una futura implementación podría usar Supabase sin tocar el dominio ni la UI.
 */
export interface RepositoryInterface {
  // Perfil y progreso
  getProfile(): Promise<Profile | undefined>;
  saveProfile(profile: Profile): Promise<void>;
  getProgress(): Promise<UserProgress>;
  saveProgress(progress: UserProgress): Promise<void>;

  // Mastery
  getMastery(conceptId: string): Promise<ConceptMastery | undefined>;
  getAllMasteries(): Promise<ConceptMastery[]>;
  upsertMastery(m: ConceptMastery): Promise<void>;

  // Repasos
  getReview(conceptId: string): Promise<ReviewSchedule | undefined>;
  getAllReviews(): Promise<ReviewSchedule[]>;
  upsertReview(r: ReviewSchedule): Promise<void>;

  // Errores
  getErrors(): Promise<ErrorRecord[]>;
  recordError(input: Omit<ErrorRecord, "id" | "firstOccurrence" | "lastOccurrence" | "count" | "resolved">): Promise<void>;

  // Sesiones y attempts
  createSession(s: DailySession): Promise<void>;
  completeSession(s: DailySession): Promise<void>;
  appendAttempt(a: Attempt): Promise<void>;
  getRecentSessions(limit: number): Promise<DailySession[]>;
}
