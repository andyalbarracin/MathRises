import { FileCheck2, Shapes, Layers, type LucideIcon } from "lucide-react";
import type { ModuleId } from "@/domain/types";
import { createRng, seedFromString } from "@/lib/rng";
import { generateExercise, TEMPLATES, type GeneratedExercise } from "@/domain/exercises";
import { PLAYABLE, PLAYABLE_ORDER } from "./concepts";

export const MODULE_LABEL: Record<ModuleId, string> = {
  FUNDAMENTOS: "Fundamentos",
  ALGEBRA: "Álgebra",
  ECUACIONES: "Ecuaciones",
  GEOMETRIA_I: "Geometría",
  FUNCIONES: "Funciones",
  GEOMETRIA_II: "Geometría",
  TRIGONOMETRIA: "Trigonometría",
  EXP_LOG: "Exponenciales y logaritmos",
  COMPLEJOS: "Números complejos",
  INTEGRACION: "Repaso",
  SIMULACROS: "Simulacros",
};

function byModules(mods: ModuleId[]): string[] {
  return PLAYABLE_ORDER.filter((id) => mods.includes(PLAYABLE[id].concept.module));
}

export interface MockExamConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: "violet" | "green" | "blue";
  durationMin: number;
  questionCount: number;
  pool: string[];
}

export const MOCK_EXAMS: MockExamConfig[] = [
  {
    id: "matematica",
    title: "Simulacro de Matemática",
    subtitle: "Álgebra, ecuaciones, funciones, logaritmos y complejos",
    icon: FileCheck2,
    tone: "violet",
    durationMin: 30,
    questionCount: 12,
    pool: byModules(["FUNDAMENTOS", "ALGEBRA", "ECUACIONES", "FUNCIONES", "EXP_LOG", "COMPLEJOS"]),
  },
  {
    id: "geometria",
    title: "Simulacro de Geometría",
    subtitle: "Geometría plana y trigonometría",
    icon: Shapes,
    tone: "green",
    durationMin: 25,
    questionCount: 10,
    pool: byModules(["GEOMETRIA_I", "GEOMETRIA_II", "TRIGONOMETRIA"]),
  },
  {
    id: "integral",
    title: "Simulacro integral",
    subtitle: "Todo el temario mezclado, como en el examen",
    icon: Layers,
    tone: "blue",
    durationMin: 40,
    questionCount: 15,
    pool: [...PLAYABLE_ORDER],
  },
];

export function getMockExam(id: string): MockExamConfig | undefined {
  return MOCK_EXAMS.find((e) => e.id === id);
}

export interface MockQuestion {
  conceptId: string;
  module: ModuleId;
  exercise: GeneratedExercise;
}

/** Arma el set de preguntas del simulacro, distribuido entre los temas del pool. */
export function buildMockQuestions(config: MockExamConfig, seed: string): MockQuestion[] {
  const rng = createRng(seedFromString(seed));
  const pool = [...config.pool];
  // Baraja el pool para variar el orden de temas.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const out: MockQuestion[] = [];
  for (let i = 0; i < config.questionCount; i++) {
    const conceptId = pool[i % pool.length];
    const playable = PLAYABLE[conceptId];
    const templateId = playable.templateIds[rng.int(0, playable.templateIds.length - 1)];
    const exercise = generateExercise(TEMPLATES[templateId], `${seed}-${i}`, i);
    out.push({ conceptId, module: playable.concept.module, exercise });
  }
  return out;
}
