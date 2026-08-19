/**
 * Marca de Mateicos Matemáticos: isotipo (archivo intercambiable en
 * `public/logo/mark.svg`) + wordmark en dos líneas (se adapta al tema).
 * Ver public/logo/README.md.
 */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/mark.svg" width={28} height={28} alt="Mateicos Matemáticos" draggable={false} />
      {!compact && (
        <span className="font-display text-[15px] font-bold leading-[1.05] tracking-tight text-ink">
          <span className="block">Mateicos</span>
          <span className="block text-accent">Matemáticos</span>
        </span>
      )}
    </div>
  );
}
