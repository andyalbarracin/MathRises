/**
 * Mascota original de RiseMath: personaje geométrico amigable (no copia mascotas).
 * Construido con formas simples y coloreable por tono.
 */

export type Tone = "violet" | "blue" | "green" | "amber" | "coral";
export type Expression = "happy" | "cheer" | "think";

const TONE_VARS: Record<Tone, { body: string; soft: string }> = {
  violet: { body: "var(--c-violet)", soft: "var(--c-violet-soft)" },
  blue: { body: "var(--c-blue)", soft: "var(--c-blue-soft)" },
  green: { body: "var(--c-green)", soft: "var(--c-green-soft)" },
  amber: { body: "var(--c-amber)", soft: "var(--c-amber-soft)" },
  coral: { body: "var(--c-coral)", soft: "var(--c-coral-soft)" },
};

/** Símbolo matemático que lleva la mascota en el pecho. */
function Emblem({ symbol }: { symbol?: string }) {
  if (!symbol) return null;
  return (
    <text
      x="50"
      y="70"
      textAnchor="middle"
      fontSize="20"
      fontWeight="800"
      fill="#ffffff"
      fontFamily="var(--font-display)"
      opacity="0.9"
    >
      {symbol}
    </text>
  );
}

export function Mascot({
  tone = "violet",
  expression = "happy",
  symbol,
  size = 120,
  className,
}: {
  tone?: Tone;
  expression?: Expression;
  symbol?: string;
  size?: number;
  className?: string;
}) {
  const c = TONE_VARS[tone];
  const cheer = expression === "cheer";
  const think = expression === "think";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Mascota de RiseMath"
    >
      {/* piecitos */}
      <ellipse cx="38" cy="92" rx="7" ry="5" fill={c.body} />
      <ellipse cx="62" cy="92" rx="7" ry="5" fill={c.body} />

      {/* bracitos */}
      {cheer ? (
        <>
          <rect x="12" y="34" width="8" height="20" rx="4" fill={c.body} transform="rotate(-35 16 44)" />
          <rect x="80" y="34" width="8" height="20" rx="4" fill={c.body} transform="rotate(35 84 44)" />
        </>
      ) : (
        <>
          <rect x="14" y="52" width="8" height="18" rx="4" fill={c.body} />
          <rect x="78" y="52" width="8" height="18" rx="4" fill={c.body} />
        </>
      )}

      {/* cuerpo */}
      <rect x="22" y="26" width="56" height="62" rx="24" fill={c.body} />
      {/* pancita */}
      <ellipse cx="50" cy="64" rx="20" ry="18" fill="#ffffff" opacity="0.16" />
      <Emblem symbol={symbol} />

      {/* carita */}
      <ellipse cx="50" cy="44" rx="22" ry="18" fill="#ffffff" />
      {/* ojos */}
      {think ? (
        <>
          <circle cx="42" cy="42" r="3.4" fill="#211d38" />
          <path d="M54 40 q4 -3 8 0" stroke="#211d38" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="42" cy="42" r="4" fill="#211d38" />
          <circle cx="58" cy="42" r="4" fill="#211d38" />
          <circle cx="43.4" cy="40.6" r="1.3" fill="#fff" />
          <circle cx="59.4" cy="40.6" r="1.3" fill="#fff" />
        </>
      )}
      {/* cachetes */}
      <circle cx="35" cy="49" r="3.6" fill={c.body} opacity="0.3" />
      <circle cx="65" cy="49" r="3.6" fill={c.body} opacity="0.3" />
      {/* boca */}
      {cheer ? (
        <path d="M42 50 q8 10 16 0 q-8 4 -16 0Z" fill="#211d38" />
      ) : (
        <path d="M44 51 q6 6 12 0" stroke="#211d38" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      )}
      {/* antenita */}
      <line x1="50" y1="26" x2="50" y2="16" stroke={c.body} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="14" r="4" fill={c.body} />
    </svg>
  );
}
