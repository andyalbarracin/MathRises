/**
 * Marca de RiseMath: isotipo (archivo intercambiable en `public/logo/mark.svg`)
 * + wordmark en texto (se adapta al tema). Ver public/logo/README.md.
 */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/mark.svg" width={26} height={26} alt="RiseMath" draggable={false} />
      {!compact && (
        <span className="font-display text-lg leading-none tracking-tight text-ink">
          Rise<span className="text-accent">Math</span>
        </span>
      )}
    </div>
  );
}
