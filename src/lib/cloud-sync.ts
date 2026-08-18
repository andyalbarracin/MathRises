import { getSupabase } from "./supabase";
import { getDB } from "@/data/local/db";

/**
 * Sincronización local-first con Supabase.
 * La app sigue funcionando 100% offline con IndexedDB; la nube es un respaldo
 * y permite usar la misma cuenta en varios dispositivos. Se guarda TODO el
 * estado del alumno como un único JSON por usuario (modelo simple y robusto).
 */

type LocalState = Record<string, unknown[]>;

const LAST_SYNC_KEY = "rm-cloud-synced";
const listeners = new Set<() => void>();

interface CloudState {
  email: string | null;
  syncing: boolean;
  lastSyncedAt: number | null;
}

let state: CloudState = { email: null, syncing: false, lastSyncedAt: readLastSync() };
let initialized = false;

function readLastSync(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(LAST_SYNC_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
function setLastSync(t: number) {
  try {
    localStorage.setItem(LAST_SYNC_KEY, String(t));
  } catch {
    /* almacenamiento no disponible */
  }
  update({ lastSyncedAt: t });
}
function update(patch: Partial<CloudState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function subscribeCloud(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getCloudState(): CloudState {
  return state;
}

const TABLES = [
  "profile",
  "progress",
  "masteries",
  "reviews",
  "errors",
  "sessions",
  "attempts",
  "diagnostic",
  "mockExams",
] as const;

async function exportState(): Promise<LocalState> {
  const db = getDB();
  const out: LocalState = {};
  for (const t of TABLES) {
    out[t] = await db.table(t).toArray();
  }
  return out;
}

async function importState(data: LocalState): Promise<void> {
  const db = getDB();
  await db.transaction("rw", TABLES as unknown as string[], async () => {
    for (const t of TABLES) {
      await db.table(t).clear();
      const rows = data[t];
      if (Array.isArray(rows) && rows.length) await db.table(t).bulkPut(rows);
    }
  });
}

export async function pushToCloud(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data: userData } = await sb.auth.getUser();
  const user = userData.user;
  if (!user) return false;
  update({ syncing: true });
  try {
    const payload = await exportState();
    const { error } = await sb
      .from("user_state")
      .upsert({ user_id: user.id, data: payload, updated_at: new Date().toISOString() });
    if (error) throw error;
    setLastSync(Date.now());
    return true;
  } finally {
    update({ syncing: false });
  }
}

export async function pullFromCloud(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data: userData } = await sb.auth.getUser();
  const user = userData.user;
  if (!user) return false;
  update({ syncing: true });
  try {
    const { data, error } = await sb.from("user_state").select("data").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (data?.data) {
      await importState(data.data as LocalState);
      setLastSync(Date.now());
      return true;
    }
    return false;
  } finally {
    update({ syncing: false });
  }
}

/** Al iniciar sesión: nunca pisa datos locales sin permiso. */
async function syncOnLogin(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { data: userData } = await sb.auth.getUser();
  const user = userData.user;
  if (!user) return;

  const prog = await getDB().progress.get("me");
  const localOnboarded = Boolean(prog?.onboardingComplete);

  const { data: row } = await sb.from("user_state").select("updated_at").eq("user_id", user.id).maybeSingle();

  if (!row) {
    await pushToCloud(); // nube vacía → subimos lo local
  } else if (!localOnboarded) {
    await pullFromCloud(); // local vacío → bajamos de la nube
  } else {
    await pushToCloud(); // ambos con datos → mantenemos lo local (se puede bajar manual)
  }
}

// --- Auth ---
export async function signUp(email: string, password: string): Promise<{ needsConfirm: boolean }> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase no está configurado.");
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  return { needsConfirm: !data.session };
}

export async function signIn(email: string, password: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase no está configurado.");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

/** Inicializa el listener de auth y sincroniza al entrar. Idempotente. */
export function initCloud(): void {
  if (initialized) return;
  const sb = getSupabase();
  if (!sb) return;
  initialized = true;

  let syncedThisSession = false;
  sb.auth.onAuthStateChange((event, session) => {
    update({ email: session?.user?.email ?? null });
    if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session && !syncedThisSession) {
      syncedThisSession = true;
      void syncOnLogin();
    }
    if (event === "SIGNED_OUT") {
      syncedThisSession = false;
    }
  });

  // Respaldo al ocultar la pestaña (multi-dispositivo).
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && state.email) void pushToCloud();
  });
}
