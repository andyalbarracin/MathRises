import { BookOpen, Dumbbell, PencilRuler, RefreshCw, Coffee, type LucideIcon } from "lucide-react";
import type { SessionType } from "@/domain/types";
import type { TileTone } from "@/components/ui/tile";

export interface SessionTypeInfo {
  type: SessionType;
  label: string;
  blurb: string;
  tone: TileTone;
  icon: LucideIcon;
  /** Categoría de puntos que prioriza. */
  points: string;
  minutes: string;
}

export const SESSION_TYPES: Record<SessionType, SessionTypeInfo> = {
  conceptos: {
    type: "conceptos",
    label: "Conceptos",
    blurb: "Aprendé la idea y elegí la opción correcta. Ideal para arrancar un tema.",
    tone: "violet",
    icon: BookOpen,
    points: "aprendizaje",
    minutes: "~10 min",
  },
  practica: {
    type: "practica",
    label: "Práctica",
    blurb: "Resolvé ejercicios con pistas y corrección al instante.",
    tone: "green",
    icon: Dumbbell,
    points: "práctica",
    minutes: "~15 min",
  },
  resolver: {
    type: "resolver",
    label: "Resolver",
    blurb: "Sentate a resolver problemas con calma, paso a paso.",
    tone: "blue",
    icon: PencilRuler,
    points: "práctica",
    minutes: "~20 min",
  },
  repaso: {
    type: "repaso",
    label: "Repaso",
    blurb: "Volvé a lo que ya viste, en el momento justo para no olvidarlo.",
    tone: "amber",
    icon: RefreshCw,
    points: "repaso",
    minutes: "~8 min",
  },
  tranquilo: {
    type: "tranquilo",
    label: "Modo tranquilo",
    blurb: "Solo leer conceptos y ejemplos. Perfecto para el colectivo.",
    tone: "coral",
    icon: Coffee,
    points: "repaso",
    minutes: "~5 min",
  },
};

export const SESSION_TYPE_ORDER: SessionType[] = [
  "conceptos",
  "practica",
  "resolver",
  "repaso",
  "tranquilo",
];
