import { MENTORS, type MentorSlug } from "@/content/mentors";
import { cn } from "@/lib/utils";

const ACCENT: Record<string, { text: string; ring: string; glow: string }> = {
  accent: { text: "text-accent", ring: "border-accent/35", glow: "bg-accent/10" },
  "accent-2": { text: "text-accent-2", ring: "border-accent-2/35", glow: "bg-accent-2/10" },
  success: { text: "text-success", ring: "border-success/35", glow: "bg-success/10" },
  warn: { text: "text-warn", ring: "border-warn/35", glow: "bg-warn/10" },
};

/** Glifo de dominio por mentor (minimalista, técnico). */
function Glyph({ slug }: { slug: MentorSlug }) {
  switch (slug) {
    case "vector": // flecha ascendente (álgebra, dirección)
      return (
        <>
          <path d="M13 35 L35 13" strokeLinecap="round" />
          <path d="M24 13 H35 V24" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "delta": // triángulo (geometría)
      return (
        <>
          <path d="M24 12 L35 34 H13 Z" strokeLinejoin="round" />
          <circle cx="24" cy="27" r="2.4" className="fill-current" stroke="none" />
        </>
      );
    case "sigma": // nodos conectados (patrones, análisis)
      return (
        <>
          <path d="M15 15 L33 24 L15 33" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="15" cy="15" r="2.6" className="fill-current" stroke="none" />
          <circle cx="33" cy="24" r="2.6" className="fill-current" stroke="none" />
          <circle cx="15" cy="33" r="2.6" className="fill-current" stroke="none" />
        </>
      );
    case "atlas": // hexágono (industria, operaciones)
      return (
        <>
          <path d="M24 11 L35 17.5 V30.5 L24 37 L13 30.5 V17.5 Z" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="4" />
        </>
      );
    case "morgan": // barras ascendentes (negocios, métricas)
      return (
        <>
          <path d="M15 33 V26" strokeLinecap="round" />
          <path d="M24 33 V20" strokeLinecap="round" />
          <path d="M33 33 V14" strokeLinecap="round" />
        </>
      );
  }
}

export function MentorAvatar({ slug, size = 44 }: { slug: MentorSlug; size?: number }) {
  const mentor = MENTORS[slug];
  const a = ACCENT[mentor.accent] ?? ACCENT.accent;
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center rounded-xl border bg-surface-2",
        a.ring,
        a.text,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${mentor.name}, ${mentor.role}`}
    >
      <span className={cn("absolute inset-1 rounded-lg", a.glow)} aria-hidden />
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        className="relative"
        aria-hidden
      >
        <Glyph slug={slug} />
      </svg>
    </div>
  );
}

export function MentorMessage({
  slug,
  message,
  title,
}: {
  slug: MentorSlug;
  message: string;
  title?: string;
}) {
  const mentor = MENTORS[slug];
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-2/60 p-4">
      <MentorAvatar slug={slug} />
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">
          <span className="font-medium text-ink">{mentor.name}</span> · {title ?? mentor.role}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{message}</p>
      </div>
    </div>
  );
}
