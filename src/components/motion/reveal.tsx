"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Entrada suave (fade + leve desplazamiento), con stagger opcional para los hijos.
 * Ease-out exponencial, sin rebote. Respeta prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  y = 14,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? el.children : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.5,
        ease: "power3.out",
        stagger: stagger ? 0.06 : 0,
        clearProps: "opacity,transform",
      });
    }, el);
    return () => ctx.revert();
  }, [stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
