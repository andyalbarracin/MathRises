import type { Concept } from "@/domain/types";
import { Calculator, Divide, ListOrdered, type LucideIcon } from "lucide-react";
import type { TileTone } from "@/components/ui/tile";
import {
  fraccionesConcept,
  fraccionesLesson,
  FRACCIONES_CONCEPT_ID,
  type LessonContent,
} from "./fractions";
import { enterosConcept, enterosLesson, ENTEROS_CONCEPT_ID } from "./integers";
import { ordenConcept, ordenLesson, ORDEN_CONCEPT_ID } from "./order-ops";

export interface PlayableConcept {
  concept: Concept;
  lesson: LessonContent;
  templateIds: string[];
  tone: TileTone;
  icon: LucideIcon;
}

export const PLAYABLE: Record<string, PlayableConcept> = {
  [ENTEROS_CONCEPT_ID]: {
    concept: enterosConcept,
    lesson: enterosLesson,
    templateIds: ["INTEGER_ADD", "INTEGER_MULT", "INTEGER_COMPARE"],
    tone: "blue",
    icon: Calculator,
  },
  [ORDEN_CONCEPT_ID]: {
    concept: ordenConcept,
    lesson: ordenLesson,
    templateIds: ["ORDER_BASIC", "ORDER_PAREN", "ORDER_STEP"],
    tone: "amber",
    icon: ListOrdered,
  },
  [FRACCIONES_CONCEPT_ID]: {
    concept: fraccionesConcept,
    lesson: fraccionesLesson,
    templateIds: ["FRACTION_SIMPLIFY", "FRACTION_ADD", "FRACTION_EQUIVALENCE", "FRACTION_ERROR_SPOTTING"],
    tone: "violet",
    icon: Divide,
  },
};

/** Conceptos jugables en orden de aparición. */
export const PLAYABLE_ORDER = [ENTEROS_CONCEPT_ID, ORDEN_CONCEPT_ID, FRACCIONES_CONCEPT_ID];

export function getPlayable(conceptId: string): PlayableConcept | undefined {
  return PLAYABLE[conceptId];
}

export function isPlayable(conceptId: string): boolean {
  return conceptId in PLAYABLE;
}
