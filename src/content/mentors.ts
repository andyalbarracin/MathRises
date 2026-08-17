import type { Tone } from "@/components/art/mascot";

export type MentorSlug = "vector" | "delta" | "sigma" | "atlas" | "morgan";

export interface Mentor {
  slug: MentorSlug;
  name: string;
  role: string;
  tone: Tone;
  symbol: string;
}

export const MENTORS: Record<MentorSlug, Mentor> = {
  vector: { slug: "vector", name: "Vector", role: "Ingeniero pragmático", tone: "blue", symbol: "x" },
  delta: { slug: "delta", name: "Delta", role: "Especialista en geometría", tone: "coral", symbol: "Δ" },
  sigma: { slug: "sigma", name: "Sigma", role: "Mentora analítica", tone: "violet", symbol: "Σ" },
  atlas: { slug: "atlas", name: "Atlas", role: "Operaciones industriales", tone: "amber", symbol: "%" },
  morgan: { slug: "morgan", name: "Morgan", role: "Negocios y finanzas", tone: "green", symbol: "$" },
};

/** Mensajes de cierre según el desempeño (concisos, cálidos, sin épica hueca). */
export function mentorClosing(accuracy: number): { mentor: MentorSlug; message: string } {
  if (accuracy >= 0.9) {
    return {
      mentor: "sigma",
      message:
        "¡Muy sólido! Cuando algo sale bien varias veces seguidas, lo agendo más espaciado. Nos vemos en unos días con esto.",
    };
  }
  if (accuracy >= 0.6) {
    return {
      mentor: "sigma",
      message:
        "Buen avance. Marqué los puntos flojos para repasarlos pronto: se afianzan con repetición, no con apuro.",
    };
  }
  return {
    mentor: "sigma",
    message:
      "Costó, y está perfecto: así aprende el cerebro. Te programé un repaso corto para reforzarlo mañana.",
  };
}
