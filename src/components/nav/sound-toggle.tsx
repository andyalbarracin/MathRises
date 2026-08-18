"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, subscribeSound, playSound } from "@/lib/sound";

function useSoundOn() {
  return useSyncExternalStore(
    (cb) => subscribeSound(cb),
    () => isSoundEnabled(),
    () => true,
  );
}

export function SoundToggle({ compact = false }: { compact?: boolean }) {
  const on = useSoundOn();

  function toggle() {
    const next = !on;
    setSoundEnabled(next);
    if (next) playSound("tap");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={on ? "Silenciar sonidos" : "Activar sonidos"}
      className="md-state flex items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
      aria-label={on ? "Silenciar sonidos" : "Activar sonidos"}
    >
      {on ? <Volume2 className="h-[18px] w-[18px]" /> : <VolumeX className="h-[18px] w-[18px]" />}
      {!compact && (on ? "Sonido" : "Silenciado")}
    </button>
  );
}
