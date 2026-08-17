import { MENTORS, type MentorSlug } from "@/content/mentors";
import { cn } from "@/lib/utils";

const ACCENT_CLASS: Record<string, string> = {
  accent: "text-accent",
  "accent-2": "text-accent-2",
  success: "text-success",
  warn: "text-warn",
};

/** Avatar SVG original (placeholder geométrico, sin copiar mascotas). */
export function MentorAvatar({ slug, size = 40 }: { slug: MentorSlug; size?: number }) {
  const mentor = MENTORS[slug];
  const color = ACCENT_CLASS[mentor.accent] ?? "text-accent";
  const initial = mentor.name[0];
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-lg border border-border bg-surface-2",
        color,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="absolute inset-0">
        <path d="M6 30 L14 20 L20 25 L34 10" stroke="currentColor" strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />
      </svg>
      <span className="font-display text-base leading-none">{initial}</span>
    </div>
  );
}

export function MentorMessage({
  slug,
  message,
}: {
  slug: MentorSlug;
  message: string;
}) {
  const mentor = MENTORS[slug];
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-2/60 p-4">
      <MentorAvatar slug={slug} />
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">
          <span className="font-medium text-ink">{mentor.name}</span> · {mentor.role}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{message}</p>
      </div>
    </div>
  );
}
