/**
 * Mascota original de RiseMath: un perrito blanco expresivo (estilo caricatura,
 * inspirado en beagles) con orejas y nariz negras y un collar del color del mentor.
 * Diseño propio (no reproduce personajes con derechos de autor).
 */

export type Tone = "violet" | "blue" | "green" | "amber" | "coral";
export type Expression = "happy" | "cheer" | "think" | "oops";

const TONE_VAR: Record<Tone, string> = {
  violet: "var(--c-violet)",
  blue: "var(--c-blue)",
  green: "var(--c-green)",
  amber: "var(--c-amber)",
  coral: "var(--c-coral)",
};

const OUTLINE = "#2a2833";
const BLACK = "#211f2a";
const WHITE = "#ffffff";

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
  const collar = TONE_VAR[tone];
  const cheer = expression === "cheer";
  const think = expression === "think";
  const oops = expression === "oops";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Mascota de RiseMath"
      fill="none"
    >
      <g stroke={OUTLINE} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {/* cola */}
        <path d="M74 84 q14 2 12 -12" fill={WHITE} />

        {/* cuerpo sentado */}
        <path d="M30 95 Q24 74 32 66 L68 66 Q76 74 70 95 Z" fill={WHITE} />
        {/* patitas delanteras */}
        <ellipse cx="42" cy="92" rx="7" ry="5" fill={WHITE} />
        <ellipse cx="58" cy="92" rx="7" ry="5" fill={WHITE} />

        {/* bracitos (festejo) */}
        {cheer && (
          <>
            <path d="M30 66 Q18 58 14 46" fill="none" strokeWidth="5" />
            <path d="M70 66 Q82 58 86 46" fill="none" strokeWidth="5" />
          </>
        )}

        {/* collar */}
        <path d="M34 66 Q50 72 66 66" fill="none" stroke={collar} strokeWidth="6" />
        <circle cx="50" cy="71" r="5.5" fill={collar} stroke={OUTLINE} strokeWidth="1.6" />
        {symbol && (
          <text
            x="50"
            y="74.5"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill={WHITE}
            stroke="none"
            fontFamily="var(--font-display)"
          >
            {symbol}
          </text>
        )}

        {/* orejas negras (detrás de la cabeza) */}
        <path d="M31 34 Q18 40 22 58 Q30 60 34 48 Z" fill={BLACK} />
        <path d="M69 34 Q82 40 78 58 Q70 60 66 48 Z" fill={BLACK} />

        {/* cabeza */}
        <circle cx="50" cy="43" r="22" fill={WHITE} />

        {/* mancha negra sobre un ojo */}
        <path d="M56 30 Q68 30 66 44 Q60 50 54 44 Q52 34 56 30 Z" fill={BLACK} stroke="none" />

        {/* hocico */}
        <ellipse cx="50" cy="52" rx="13" ry="10" fill={WHITE} />
        <ellipse cx="50" cy="49" rx="4.2" ry="3.4" fill={BLACK} stroke="none" />
      </g>

      {/* ojos */}
      {think ? (
        <>
          <path d="M39 41 q3 -3 6 0" stroke={OUTLINE} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="59" cy="41" r="2.6" fill={WHITE} />
          <circle cx="59.6" cy="40.4" r="1.8" fill={BLACK} />
        </>
      ) : cheer ? (
        <>
          <path d="M37 42 q4 -5 8 0" stroke={OUTLINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M55 42 q4 -5 8 0" stroke={WHITE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="41" cy="42" r="3.1" fill={BLACK} />
          <circle cx="59" cy="42" r="3.1" fill={WHITE} />
          <circle cx="59" cy="42" r="2.2" fill={BLACK} />
          <circle cx="42" cy="41" r="1" fill={WHITE} />
        </>
      )}

      {/* cejas de preocupación (ups) */}
      {oops && (
        <>
          <path d="M36 36 l7 2" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
          <path d="M64 36 l-7 2" stroke={WHITE} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* boca */}
      {cheer ? (
        <g stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round">
          <path d="M43 54 q7 9 14 0 q-7 5 -14 0 Z" fill={BLACK} stroke="none" />
          <path d="M50 58 q0 5 4 5 q3 0 3 -3" fill={collar} strokeWidth="1.4" />
        </g>
      ) : oops ? (
        <path d="M45 59 q3 -3 5 0 q2 3 5 0" stroke={OUTLINE} strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : think ? (
        <circle cx="52" cy="59" r="2" fill={OUTLINE} />
      ) : (
        <path d="M44 57 q6 5 12 0" stroke={OUTLINE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
