import { cn } from "@/lib/utils";

export type TileTone = "violet" | "green" | "blue" | "amber" | "coral";

const TONE: Record<TileTone, { bg: string; fg: string }> = {
  violet: { bg: "bg-c-violet-soft", fg: "text-c-violet" },
  green: { bg: "bg-c-green-soft", fg: "text-c-green" },
  blue: { bg: "bg-c-blue-soft", fg: "text-c-blue" },
  amber: { bg: "bg-c-amber-soft", fg: "text-c-amber" },
  coral: { bg: "bg-c-coral-soft", fg: "text-c-coral" },
};

/** Cuadrado redondeado con ícono, en el color de la categoría. */
export function Tile({
  icon: Icon,
  tone = "violet",
  size = 52,
  className,
}: {
  icon: React.ElementType;
  tone?: TileTone;
  size?: number;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <div
      className={cn("grid shrink-0 place-items-center rounded-2xl", t.bg, t.fg, className)}
      style={{ width: size, height: size }}
    >
      <Icon style={{ width: size * 0.44, height: size * 0.44 }} strokeWidth={2.4} />
    </div>
  );
}

export const TILE_TONE_TEXT: Record<TileTone, string> = {
  violet: "text-c-violet",
  green: "text-c-green",
  blue: "text-c-blue",
  amber: "text-c-amber",
  coral: "text-c-coral",
};
