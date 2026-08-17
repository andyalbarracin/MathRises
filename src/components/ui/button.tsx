import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-bold transition-all duration-150 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/25 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Botón "jugoso" con borde inferior 3D que se hunde al presionar.
        primary:
          "bg-accent text-accent-ink border-b-[3px] border-accent-strong hover:brightness-[1.03] active:border-b-0 active:mt-[3px] shadow-pop",
        secondary:
          "bg-surface text-ink border-2 border-border hover:border-accent/50 active:translate-y-0.5",
        soft: "bg-accent-soft text-accent hover:brightness-[0.98]",
        ghost: "text-ink-muted hover:bg-surface-2 hover:text-ink",
        success:
          "bg-success text-white border-b-[3px] border-black/15 active:border-b-0 active:mt-[3px]",
        danger:
          "bg-danger text-white border-b-[3px] border-black/15 active:border-b-0 active:mt-[3px]",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
