import { describe, it, expect } from "vitest";
import { scoreDiagnostic, buildSeedMasteries, labelText } from "./index";
import { DIAGNOSTIC } from "@/content/diagnostic";

// Helpers para armar respuestas.
function allCorrect(): Record<string, string> {
  return Object.fromEntries(DIAGNOSTIC.map((q) => [q.id, q.correctId]));
}
function allWrongFor(prefix: string): Record<string, string> {
  const ans: Record<string, string> = {};
  for (const q of DIAGNOSTIC) {
    if (!q.id.startsWith(prefix)) continue;
    // elige una opción distinta a la correcta
    const wrong = q.options.find((o) => o.id !== q.correctId)!.id;
    ans[q.id] = wrong;
  }
  return ans;
}

describe("scoreDiagnostic", () => {
  it("todas correctas => todas las áreas 'Sólido'", () => {
    const results = scoreDiagnostic(allCorrect());
    expect(results.every((r) => r.label === "solid")).toBe(true);
    expect(results.every((r) => r.total > 0)).toBe(true);
  });

  it("área sin responder queda 'Sin evaluar'", () => {
    const results = scoreDiagnostic({});
    expect(results.every((r) => r.label === "unseen" && r.total === 0)).toBe(true);
  });

  it("todas mal en un área => 'Frágil'", () => {
    const results = scoreDiagnostic(allWrongFor("ar"));
    const arit = results.find((r) => r.area === "aritmetica")!;
    expect(arit.label).toBe("fragile");
    expect(arit.correct).toBe(0);
  });
});

describe("buildSeedMasteries", () => {
  it("siembra mastery para conceptos de áreas evaluadas", () => {
    const results = scoreDiagnostic(allCorrect());
    const seeds = buildSeedMasteries(results);
    const frac = seeds.find((m) => m.conceptId === "fracciones-basicas");
    expect(frac).toBeDefined();
    expect(frac!.level).toBe(3); // "Sólido" => nivel 3
  });

  it("no siembra nada para áreas sin evaluar", () => {
    expect(buildSeedMasteries(scoreDiagnostic({}))).toHaveLength(0);
  });
});

describe("labelText", () => {
  it("expone textos en español", () => {
    expect(labelText("solid")).toBe("Sólido");
    expect(labelText("unseen")).toBe("Sin evaluar");
  });
});
