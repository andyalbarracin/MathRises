/** Marca de RiseMath: nodo técnico + wordmark. Original, sin AI-slop. */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden
        className="text-accent"
      >
        <rect
          x="1.5"
          y="1.5"
          width="23"
          height="23"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        {/* trazo ascendente de plano */}
        <path
          d="M6 18 L11 12 L15 15 L20 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="7" r="2.2" fill="currentColor" />
      </svg>
      {!compact && (
        <span className="font-display text-lg leading-none tracking-tight text-ink">
          Rise<span className="text-accent">Math</span>
        </span>
      )}
    </div>
  );
}
