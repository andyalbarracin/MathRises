/** Fecha local en formato YYYY-MM-DD. */
export function todayStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Días restantes hasta una fecha ISO (YYYY-MM-DD). */
export function daysUntil(isoDate: string, from: Date = new Date()): number {
  const target = Date.parse(isoDate + "T00:00:00");
  const base = Date.parse(todayStr(from) + "T00:00:00");
  return Math.round((target - base) / 86_400_000);
}
