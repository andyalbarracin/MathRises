"use client";

import { useState } from "react";
import { Delete, Check } from "lucide-react";
import { Katex } from "@/components/math/katex";

/** Convierte lo tipeado en LaTeX para la vista previa. */
function toPreviewLatex(raw: string): string {
  if (raw === "" || raw === "-") return "\\square";
  const frac = raw.match(/^(-?\d+)\/(\d*)$/);
  if (frac) return `\\dfrac{${frac[1]}}{${frac[2] || "\\square"}}`;
  return raw;
}

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "±", "0", "/"];

export function MathAnswerPad({
  onSubmit,
  disabled,
  allowFraction = true,
}: {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  allowFraction?: boolean;
}) {
  const [value, setValue] = useState("");

  function press(k: string) {
    if (disabled) return;
    setValue((v) => {
      if (k === "±") {
        return v.startsWith("-") ? v.slice(1) : "-" + v;
      }
      if (k === "/") {
        if (!allowFraction || v.includes("/") || v === "" || v === "-") return v;
        return v + "/";
      }
      return v + k;
    });
  }

  const canSubmit = value.trim() !== "" && value !== "-" && !value.endsWith("/") && !disabled;

  return (
    <div>
      {/* Vista previa de la respuesta */}
      <div className="mb-4 grid min-h-[64px] place-items-center rounded-2xl border-2 border-dashed border-border bg-surface-2/50 px-4">
        <Katex expr={toPreviewLatex(value)} display className="text-2xl" />
      </div>

      {/* Teclado numérico (3 columnas) + borrar lateral */}
      <div className="flex gap-2.5">
        <div className="grid flex-1 grid-cols-3 gap-2.5">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              disabled={disabled || (k === "/" && !allowFraction)}
              onClick={() => press(k)}
              className="h-14 rounded-2xl border-2 border-border bg-surface text-xl font-bold text-ink transition-all hover:border-accent/50 active:translate-y-0.5 disabled:opacity-40"
            >
              {k}
            </button>
          ))}
        </div>
        <div className="flex w-16 flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setValue((v) => v.slice(0, -1))}
            disabled={disabled || value === ""}
            className="grid flex-1 place-items-center rounded-2xl border-2 border-border bg-surface text-ink transition-all hover:border-accent/50 active:translate-y-0.5 disabled:opacity-40"
            aria-label="Borrar"
          >
            <Delete className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setValue("")}
            disabled={disabled || value === ""}
            className="flex-1 rounded-2xl border-2 border-border bg-surface text-sm font-bold text-ink-muted transition-all hover:border-accent/50 active:translate-y-0.5 disabled:opacity-40"
          >
            C
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => canSubmit && onSubmit(value)}
        disabled={!canSubmit}
        className="mt-2.5 grid h-14 w-full place-items-center rounded-2xl bg-accent font-bold text-accent-ink transition-all hover:brightness-105 active:translate-y-0.5 disabled:opacity-40"
      >
        <span className="inline-flex items-center gap-2">
          <Check className="h-5 w-5" /> Responder
        </span>
      </button>
    </div>
  );
}
