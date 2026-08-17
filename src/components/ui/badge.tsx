import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
  {
    variants: {
      tone: {
        neutral: "bg-surface-2 text-ink-muted",
        accent: "bg-accent-soft text-accent",
        success: "bg-success-soft text-success",
        warn: "bg-c-amber-soft text-c-amber",
        danger: "bg-danger-soft text-danger",
        streak: "bg-c-amber-soft text-streak",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
