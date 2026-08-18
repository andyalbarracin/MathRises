/**
 * Sistema de sonidos de RiseMath (solo cliente).
 *
 * Por defecto sintetiza los efectos con la Web Audio API (no requiere archivos).
 * Si existe un archivo en `public/sounds/<nombre>.mp3`, se usa ese en su lugar.
 * Respeta la preferencia de silencio guardada en localStorage ("rm-sound").
 */

export type SoundName = "correct" | "wrong" | "complete" | "bell" | "tap" | "levelup";

/**
 * Poné en `true` cuando dejes archivos en `public/sounds/` (correct.mp3, etc.).
 * Con `false` (por defecto) la app sintetiza los efectos y no busca archivos
 * (evita 404 en consola).
 */
const USE_SOUND_FILES = false;

const STORAGE_KEY = "rm-sound";
const listeners = new Set<() => void>();
let audioCtx: AudioContext | null = null;
const fileCache: Record<string, HTMLAudioElement | false | undefined> = {};

function readEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function isSoundEnabled(): boolean {
  return readEnabled();
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* almacenamiento no disponible */
  }
  listeners.forEach((l) => l());
}

export function subscribeSound(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.15,
) {
  const now = ac.currentTime + start;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.connect(g);
  g.connect(ac.destination);
  o.start(now);
  o.stop(now + dur + 0.03);
}

function synth(name: SoundName) {
  const ac = ctx();
  if (!ac) return;
  switch (name) {
    case "correct":
      tone(ac, 660, 0, 0.12, "triangle", 0.18);
      tone(ac, 880, 0.09, 0.18, "triangle", 0.18);
      break;
    case "wrong":
      tone(ac, 208, 0, 0.16, "sawtooth", 0.1);
      tone(ac, 156, 0.11, 0.22, "sawtooth", 0.1);
      break;
    case "complete":
      [523, 659, 784, 1047].forEach((f, i) => tone(ac, f, i * 0.09, 0.28, "triangle", 0.16));
      break;
    case "levelup":
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone(ac, f, i * 0.08, 0.3, "triangle", 0.15));
      break;
    case "bell":
      tone(ac, 880, 0, 0.5, "sine", 0.14);
      tone(ac, 1320, 0, 0.42, "sine", 0.06);
      break;
    case "tap":
      tone(ac, 480, 0, 0.05, "square", 0.07);
      break;
  }
}

function tryFile(name: SoundName): boolean {
  const cached = fileCache[name];
  if (cached === false) return false; // sabemos que no existe
  let el = cached;
  if (el === undefined) {
    el = new Audio(`/sounds/${name}.mp3`);
    el.addEventListener("error", () => {
      fileCache[name] = false;
    });
    fileCache[name] = el;
  }
  try {
    el.currentTime = 0;
    const p = el.play();
    if (p) p.catch(() => synth(name));
    return true;
  } catch {
    return false;
  }
}

export function playSound(name: SoundName) {
  if (typeof window === "undefined" || !readEnabled()) return;
  if (USE_SOUND_FILES && tryFile(name)) return;
  synth(name);
}
