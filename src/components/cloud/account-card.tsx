"use client";

import { useState, useSyncExternalStore } from "react";
import { CloudCheck, CloudUpload, CloudDownload, LogOut, UserRound } from "lucide-react";
import {
  subscribeCloud,
  getCloudState,
  signIn,
  signUp,
  signOut,
  pushToCloud,
  pullFromCloud,
} from "@/lib/cloud-sync";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

function useCloud() {
  return useSyncExternalStore(subscribeCloud, getCloudState, getCloudState);
}

export function AccountCard() {
  const cloud = useCloud();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <section className="rounded-2xl bg-surface p-5 shadow-card">
        <p className="text-sm text-ink-muted">La sincronización en la nube no está configurada.</p>
      </section>
    );
  }

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "up") {
        const { needsConfirm } = await signUp(email.trim(), password);
        setMsg(needsConfirm ? "Te enviamos un email para confirmar la cuenta." : "¡Cuenta creada!");
      } else {
        await signIn(email.trim(), password);
      }
      setPassword("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No se pudo completar.");
    } finally {
      setBusy(false);
    }
  }

  if (cloud.email) {
    return (
      <section className="rounded-2xl bg-surface p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
            <CloudCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">Sincronizado en la nube</p>
            <p className="truncate text-xs text-ink-muted">{cloud.email}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="soft" size="sm" disabled={cloud.syncing} onClick={() => pushToCloud()}>
            <CloudUpload className="h-4 w-4" /> Subir a la nube
          </Button>
          <Button
            variant="outlined"
            size="sm"
            disabled={cloud.syncing}
            onClick={async () => {
              if (await pullFromCloud()) window.location.reload();
            }}
          >
            <CloudDownload className="h-4 w-4" /> Bajar de la nube
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
        {cloud.syncing && <p className="mt-2 text-xs text-ink-muted">Sincronizando…</p>}
        {cloud.lastSyncedAt && !cloud.syncing && (
          <p className="mt-2 text-xs text-ink-muted">
            Última sincronización: {new Date(cloud.lastSyncedAt).toLocaleString("es-AR")}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <UserRound className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">{mode === "in" ? "Iniciá sesión" : "Creá tu cuenta"}</p>
          <p className="text-xs text-ink-muted">Para guardar tu progreso y usarlo en otros dispositivos.</p>
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu email"
          autoComplete="email"
          className="w-full rounded-2xl border-2 border-border bg-surface px-4 py-3 outline-none transition-colors focus:border-accent"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Contraseña"
          autoComplete={mode === "in" ? "current-password" : "new-password"}
          className="w-full rounded-2xl border-2 border-border bg-surface px-4 py-3 outline-none transition-colors focus:border-accent"
        />
      </div>
      {msg && <p className="mt-2 text-sm text-ink-muted">{msg}</p>}
      <Button className="mt-3 w-full" disabled={busy || !email || !password} onClick={submit}>
        {busy ? "…" : mode === "in" ? "Iniciar sesión" : "Crear cuenta"}
      </Button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "in" ? "up" : "in");
          setMsg(null);
        }}
        className="mt-3 w-full text-center text-sm font-bold text-accent hover:underline"
      >
        {mode === "in" ? "No tengo cuenta, crear una" : "Ya tengo cuenta, iniciar sesión"}
      </button>
    </section>
  );
}
