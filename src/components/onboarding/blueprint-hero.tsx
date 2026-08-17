"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/** Hero decorativo: dibuja una trayectoria ascendente estilo plano técnico (GSAP). */
export function BlueprintHero() {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const path = svg.querySelector<SVGPathElement>("[data-line]");
      const nodes = svg.querySelectorAll<SVGCircleElement>("[data-node]");
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, { strokeDashoffset: 0, duration: 1.4, ease: "power2.out" });
      }
      gsap.from(nodes, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.5,
        ease: "back.out(2)",
        stagger: 0.18,
        delay: 0.5,
      });
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 160"
      className="mx-auto h-32 w-full max-w-xs text-accent"
      fill="none"
      aria-hidden
    >
      {/* grilla tenue */}
      <g className="text-border" stroke="currentColor" strokeWidth="1" opacity="0.4">
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} />
        ))}
        {[80, 160, 240].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="160" />
        ))}
      </g>
      <path
        data-line
        d="M20 132 L96 96 L160 108 L232 52 L300 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [20, 132],
        [96, 96],
        [160, 108],
        [232, 52],
        [300, 24],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          data-node
          cx={cx}
          cy={cy}
          r={i === 4 ? 6 : 4}
          className={i === 4 ? "fill-accent-2" : "fill-accent"}
        />
      ))}
    </svg>
  );
}
