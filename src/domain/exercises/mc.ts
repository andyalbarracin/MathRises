import type { Rng } from "@/lib/rng";
import type { ExerciseOption } from "./types";

interface Entry {
  latex?: string;
  text?: string;
  correct: boolean;
}

/**
 * Baraja opciones de multiple-choice y devuelve el id de la correcta.
 * Deduplica opciones con el mismo texto/latex (conservando siempre la correcta),
 * para que nunca aparezcan dos opciones iguales.
 */
export function buildChoices(
  rng: Rng,
  entries: Entry[],
): { options: ExerciseOption[]; correctId: string; correctLatex: string; correctText: string } {
  const key = (e: Entry) => e.latex ?? e.text ?? "";
  const correct = entries.find((e) => e.correct);
  const rest = entries.filter((e) => !e.correct);

  const seen = new Set<string>();
  const kept: Entry[] = [];
  for (const e of [correct, ...rest]) {
    if (!e) continue;
    const k = key(e);
    if (seen.has(k)) continue;
    seen.add(k);
    kept.push({ ...e });
  }

  for (let i = kept.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [kept[i], kept[j]] = [kept[j], kept[i]];
  }

  const options: ExerciseOption[] = kept.map((e, i) => ({ id: String(i), latex: e.latex, text: e.text }));
  const idx = kept.findIndex((e) => e.correct);
  return {
    options,
    correctId: String(idx),
    correctLatex: kept[idx].latex ?? "",
    correctText: kept[idx].text ?? "",
  };
}
