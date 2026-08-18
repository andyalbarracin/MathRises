import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Botones Material 3: forma pill, state layer en hover/press, elevación sutil.
const buttonVariants = cva(
  "md-state inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-medium tracking-[0.01em] transition-[box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-ink hover:shadow-[var(--elev-1)]",
        tonal: "bg-secondary-container text-on-secondary-container hover:shadow-[var(--elev-1)]",
        soft: "bg-accent-soft text-on-primary-container",
        ghost: "bg-transparent text-accent",
        outlined: "border border-outline bg-transparent text-accent",
        success: "bg-success text-white hover:shadow-[var(--elev-1)]",
        danger: "bg-danger text-on-error hover:shadow-[var(--elev-1)]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
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
