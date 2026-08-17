import { cn } from "@/lib/utils";

/** Barra de progreso con estética de plano (segmentada opcional). */
export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number; // 0–100
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full bg-accent transition-[width] duration-500", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
