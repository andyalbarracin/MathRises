/** Escenas e íconos ilustrados originales, con formas simples. */

/** Colinas + cielo: telón de fondo cálido para héroes y celebraciones. */
export function HillsScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 180" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-soft)" />
          <stop offset="100%" stopColor="var(--surface)" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#sky)" />
      {/* sol */}
      <circle cx="320" cy="48" r="26" fill="var(--c-amber)" opacity="0.85" />
      {/* nubes */}
      <g fill="#ffffff" opacity="0.8">
        <ellipse cx="90" cy="46" rx="26" ry="13" />
        <ellipse cx="118" cy="46" rx="20" ry="11" />
      </g>
      {/* colinas */}
      <path d="M0 150 Q100 96 210 140 T400 128 V180 H0 Z" fill="var(--c-green)" opacity="0.9" />
      <path d="M0 168 Q140 120 260 158 T400 150 V180 H0 Z" fill="var(--c-green)" />
      {/* banderita en la cima */}
      <line x1="300" y1="118" x2="300" y2="92" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <path d="M300 94 L318 100 L300 106 Z" fill="var(--c-coral)" />
    </svg>
  );
}

/** Llama de racha. */
export function Flame({ size = 22, active = true }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2c2.5 3 5 5.5 5 9.5A5 5 0 0 1 7 11.5c0-1 .3-1.8.8-2.6.4 1 1 1.6 1.9 1.9C9.2 8 10.5 5.2 12 2Z"
        fill={active ? "var(--streak)" : "var(--ink-muted)"}
      />
      <path
        d="M12 8c1.3 1.6 2.4 2.9 2.4 4.7a2.4 2.4 0 0 1-4.8 0c0-.9.4-1.6 1-2.3.2.5.6.9 1.1 1C11.2 10.4 11.6 9.2 12 8Z"
        fill="#fff"
        opacity="0.55"
      />
    </svg>
  );
}

/** Regalo (palabra del día / recompensa). */
export function GiftBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <g>
        <rect x="26" y="52" width="68" height="52" rx="8" fill="var(--c-violet)" />
        <rect x="26" y="52" width="68" height="18" rx="6" fill="var(--accent-strong)" />
        <rect x="54" y="52" width="12" height="52" fill="#ffffff" opacity="0.35" />
        <path d="M60 50 C46 50 42 34 54 34 C62 34 60 50 60 50Z" fill="var(--c-coral)" />
        <path d="M60 50 C74 50 78 34 66 34 C58 34 60 50 60 50Z" fill="var(--c-coral)" />
        <circle cx="60" cy="46" r="5" fill="var(--c-amber)" />
      </g>
      <Sparkle x={20} y={30} />
      <Sparkle x={98} y={40} s={0.8} />
      <Sparkle x={92} y={86} s={0.6} />
    </svg>
  );
}

/** Trofeo / medalla de logro. */
export function Trophy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <path d="M40 30 H80 V52 A20 20 0 0 1 40 52 Z" fill="var(--c-amber)" />
      <path d="M40 34 H28 a10 10 0 0 0 12 14 Z" fill="var(--c-amber)" opacity="0.8" />
      <path d="M80 34 H92 a10 10 0 0 1 -12 14 Z" fill="var(--c-amber)" opacity="0.8" />
      <rect x="54" y="70" width="12" height="14" fill="var(--c-amber)" />
      <rect x="42" y="84" width="36" height="10" rx="4" fill="var(--accent-strong)" />
      <path d="M60 40 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 Z" fill="#fff" opacity="0.85" />
    </svg>
  );
}

export function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M6 0 C7 4 8 5 12 6 C8 7 7 8 6 12 C5 8 4 7 0 6 C4 5 5 4 6 0Z"
      fill="var(--c-amber)"
    />
  );
}

export function Sparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <Sparkle x={10} y={8} />
      <Sparkle x={40} y={20} s={0.7} />
      <Sparkle x={24} y={38} s={0.9} />
    </svg>
  );
}
