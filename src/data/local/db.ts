import Dexie, { type Table } from "dexie";
import type {
  Attempt,
  ConceptMastery,
  DailySession,
  ErrorRecord,
  Profile,
  ReviewSchedule,
  UserProgress,
} from "@/domain/types";

/** Fila única de progreso (id fijo). */
export interface ProgressRow extends UserProgress {
  id: string;
}

export class RiseMathDB extends Dexie {
  profile!: Table<Profile, string>;
  progress!: Table<ProgressRow, string>;
  masteries!: Table<ConceptMastery, string>;
  reviews!: Table<ReviewSchedule, string>;
  errors!: Table<ErrorRecord, string>;
  sessions!: Table<DailySession, string>;
  attempts!: Table<Attempt, string>;

  constructor() {
    super("risemath");
    this.version(1).stores({
      profile: "id",
      progress: "id",
      masteries: "conceptId",
      reviews: "conceptId, nextReviewAt",
      errors: "id, conceptId, *categories",
      sessions: "id, date",
      attempts: "id, sessionId, conceptId",
    });
  }
}

let _db: RiseMathDB | null = null;

/** Instancia perezosa (solo en el navegador). */
export function getDB(): RiseMathDB {
  if (typeof window === "undefined") {
    throw new Error("La base local solo está disponible en el navegador.");
  }
  if (!_db) _db = new RiseMathDB();
  return _db;
}
