import type { Rng } from "@/lib/rng";
import type { ExerciseOption } from "./types";

interface Entry {
  latex?: string;
  text?: string;
  correct: boolean;
}

/** Baraja opciones de multiple-choice y devuelve el id de la correcta. */
export function buildChoices(
  rng: Rng,
  entries: Entry[],
): { options: ExerciseOption[]; correctId: string; correctLatex: string; correctText: string } {
  const arr = entries.map((e) => ({ ...e }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const options: ExerciseOption[] = arr.map((e, i) => ({ id: String(i), latex: e.latex, text: e.text }));
  const idx = arr.findIndex((e) => e.correct);
  return {
    options,
    correctId: String(idx),
    correctLatex: arr[idx].latex ?? "",
    correctText: arr[idx].text ?? "",
  };
}
