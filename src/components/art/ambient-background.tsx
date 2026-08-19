/**
 * Fondo ambiental: formas suaves difuminadas que dan profundidad a la escena,
 * detrás de todo el contenido. Sutil y theme-aware (usa tokens de color).
 * Sin costo de interacción (pointer-events-none) ni de layout (fixed).
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Degradé base muy tenue */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 15% 0%, var(--accent-soft) 0%, transparent 45%), radial-gradient(90% 70% at 100% 100%, var(--c-blue-soft) 0%, transparent 50%)",
        }}
      />
      {/* Formas suaves */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-c-blue/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-c-green/10 blur-3xl" />
    </div>
  );
}
