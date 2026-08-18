"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { playSound } from "@/lib/sound";

interface ToastItem {
  id: number;
  emoji?: string;
  title: string;
  description?: string;
}

interface ToastApi {
  toast: (t: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  return ctx ?? { toast: () => {} };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { ...t, id }]);
    playSound("bell");
    window.setTimeout(() => {
      setItems((xs) => xs.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
        {items.map((t) => (
          <Toast key={t.id} item={t} onClose={() => setItems((xs) => xs.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, []);

  return (
    <button
      type="button"
      onClick={onClose}
      className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-border bg-surface-container-high px-4 py-3 text-left shadow-[var(--elev-3)] transition-all duration-300 ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      {item.emoji && <span className="text-xl">{item.emoji}</span>}
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">{item.title}</p>
        {item.description && <p className="text-xs text-ink-muted">{item.description}</p>}
      </div>
    </button>
  );
}
