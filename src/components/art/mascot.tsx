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

/** Poses de cuerpo entero (perro ingeniero). Archivos intercambiables en public/mascot. */
export type FullPose = "walk" | "cheer";
const FULL_POSES: Record<FullPose, { src: string; w: number; h: number }> = {
  walk: { src: "/mascot/stand.svg", w: 150, h: 165 }, // caminando con maletín
  cheer: { src: "/mascot/cheer-full.svg", w: 130, h: 165 }, // festejando
};

/**
 * Mascota de cuerpo entero (perro ingeniero: casco, corbata, maletín), para
 * pantallas grandes: hero, onboarding, cierre de sesión y avisos. `size` es la
 * altura; cada pose conserva su relación de aspecto.
 */
export function MascotFull({
  pose = "walk",
  size = 160,
  className,
}: {
  pose?: FullPose;
  size?: number;
  className?: string;
}) {
  const p = FULL_POSES[pose];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.src}
      width={Math.round((size * p.w) / p.h)}
      height={size}
      className={className}
      alt="Mascota de Mateicos Matemáticos"
      draggable={false}
    />
  );
}
