"use client";

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

/** Renderiza una expresión LaTeX con KaTeX. */
export function Katex({
  expr,
  display = false,
  className,
}: {
  expr: string;
  display?: boolean;
  className?: string;
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(expr, {
        displayMode: display,
        throwOnError: false,
        output: "html",
      });
    } catch {
      return expr;
    }
  }, [expr, display]);

  return (
    <span
      className={cn("nums", className)}
      // KaTeX genera markup determinista y seguro a partir del LaTeX.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
