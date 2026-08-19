"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mascot, MascotFull } from "@/components/art/mascot";
import { Button } from "@/components/ui/button";

/** Tips que aparecen mientras carga (originales, sobre el método de estudio). */
const TIPS = [
  "Constancia > intensidad: 15 minutos por día rinden más que 3 horas salteadas.",
  "Equivocarte es parte del método: cada error queda anotado para repasarlo.",
  "Los repasos aparecen justo antes de que algo se te olvide. No los saltees.",
  "Entender el porqué vale más que resolver rápido. Sin apuro.",
  "Un tema por vez: el camino se recorre nodo a nodo.",
  "Si un término no te cierra, tocalo: casi todos tienen una explicación simple.",
];

/** Pantalla de carga a pantalla completa, con la mascota y un tip. */
export function LoadingState({ label = "Preparando…" }: { label?: string }) {
  // Arranca con un tip fijo (coincide en SSR) y randomiza tras montar, para
  // no romper la hidratación.
  const [tip, setTip] = useState(TIPS[0]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="flex flex-col items-center">
        <MascotFull pose="walk" size={128} />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">{label}</p>
        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink">{tip}</p>
      </div>
    </div>
  );
}

/** Estado de error, con la mascota apenada y un botón para reintentar. */
export function ErrorState({
  title = "Se nos cruzaron los cables",
  description = "Algo no cargó bien. Probá de nuevo.",
  onRetry,
  retryLabel = "Reintentar",
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
      <Mascot expression="oops" size={112} />
      <h2 className="mt-4 font-display text-xl text-ink">{title}</h2>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{description}</p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

/** Pantalla 404, con la mascota pensando y un camino de vuelta. */
export function NotFoundState() {
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="flex flex-col items-center">
        <Mascot expression="think" size={120} />
        <h1 className="mt-4 font-display text-2xl text-ink">Esta página no existe</h1>
        <p className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-ink-muted">
          Puede que el enlace esté roto o que la hayamos movido.
        </p>
        <Link href="/" className="mt-5">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
