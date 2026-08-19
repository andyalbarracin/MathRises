/**
 * Mascota de RiseMath: un perrito original y expresivo.
 *
 * Los dibujos viven como archivos intercambiables en `public/mascot/<expresión>.<ext>`,
 * así se pueden reemplazar a mano sin tocar código (ver public/mascot/README.md).
 */

export type Tone = "violet" | "blue" | "green" | "amber" | "coral";
export type Expression = "happy" | "cheer" | "think" | "oops" | "wink";

/** Extensión de los assets de la mascota (svg | png | webp). */
export const MASCOT_EXT = "svg";

export function Mascot({
  expression = "happy",
  size = 120,
  className,
}: {
  tone?: Tone; // se mantiene por compatibilidad de API (no afecta al asset)
  expression?: Expression;
  symbol?: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/mascot/${expression}.${MASCOT_EXT}`}
      width={size}
      height={size}
      className={className}
      alt="Mascota de Mateicos Matemáticos"
      draggable={false}
    />
  );
}
