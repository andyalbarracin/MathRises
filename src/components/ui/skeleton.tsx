import { cn } from "@/lib/utils";

/** Bloque de carga (esqueleto) con pulso suave. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-surface-2/70", className)} aria-hidden />;
}

/**
 * Esqueleto genérico de una página con tablero: encabezado + tarjetas.
 * Se muestra mientras se cargan los datos (evita el salto de layout).
 */
export function PageSkeleton({
  cards = 4,
  maxW = "max-w-3xl",
}: {
  cards?: number;
  maxW?: string;
}) {
  return (
    <div className={cn("mx-auto w-full", maxW)} aria-busy="true">
      <Skeleton className="h-8 w-52 rounded-xl" />
      <Skeleton className="mt-2.5 h-4 w-72 rounded-lg" />
      <div className="mt-7 space-y-4">
        {Array.from({ length: cards }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
