export type MentorSlug = "vector" | "delta" | "sigma" | "atlas" | "morgan";

export interface Mentor {
  slug: MentorSlug;
  name: string;
  role: string;
  /** Color de acento del avatar (token CSS). */
  accent: "accent" | "accent-2" | "success" | "warn";
}

export const MENTORS: Record<MentorSlug, Mentor> = {
  vector: { slug: "vector", name: "Vector", role: "Ingeniero pragmático", accent: "accent" },
  delta: { slug: "delta", name: "Delta", role: "Especialista en geometría", accent: "accent-2" },
  sigma: { slug: "sigma", name: "Sigma", role: "Mentora analítica", accent: "success" },
  atlas: { slug: "atlas", name: "Atlas", role: "Operaciones industriales", accent: "warn" },
  morgan: { slug: "morgan", name: "Morgan", role: "Negocios y finanzas", accent: "accent" },
};

/** Mensajes de cierre según el desempeño (concisos, sin épica hueca). */
export function mentorClosing(accuracy: number): { mentor: MentorSlug; message: string } {
  if (accuracy >= 0.9) {
    return {
      mentor: "sigma",
      message:
        "Sólido. Cuando algo sale bien varias veces seguidas, el sistema lo agenda más espaciado. Volvemos a verlo en unos días.",
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
      "Costó, y está bien: así aprende el cerebro. Programé repaso corto de lo que falló para reforzarlo mañana.",
  };
}
