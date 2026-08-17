import { MENTORS, type MentorSlug } from "@/content/mentors";
import { Mascot, type Expression } from "@/components/art/mascot";
import { cn } from "@/lib/utils";

/** Avatar de mentor: la mascota con el tono y símbolo del personaje. */
export function MentorAvatar({
  slug,
  size = 48,
  expression = "happy",
}: {
  slug: MentorSlug;
  size?: number;
  expression?: Expression;
}) {
  const m = MENTORS[slug];
  return <Mascot tone={m.tone} symbol={m.symbol} expression={expression} size={size} />;
}

export function MentorMessage({
  slug,
  message,
  title,
  className,
}: {
  slug: MentorSlug;
  message: string;
  title?: string;
  className?: string;
}) {
  const mentor = MENTORS[slug];
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card", className)}>
      <div className="shrink-0 rounded-2xl bg-surface-2 p-1">
        <MentorAvatar slug={slug} size={52} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-ink-muted">
          {mentor.name} · {title ?? mentor.role}
        </p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink">{message}</p>
      </div>
    </div>
  );
}
