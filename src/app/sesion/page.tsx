import { SessionRunner } from "@/components/session/session-runner";
import type { SessionMode, SessionType } from "@/domain/types";
import { PLAYABLE_ORDER } from "@/content/concepts";

const MODES: SessionMode[] = ["QUICK", "STANDARD", "DEEP"];
const TYPES: SessionType[] = ["conceptos", "practica", "repaso", "resolver", "tranquilo"];

export default async function SesionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const conceptId = get("concept") ?? PLAYABLE_ORDER[0];
  const rawType = get("type");
  const type = (rawType && TYPES.includes(rawType as SessionType) ? rawType : "practica") as SessionType;
  const rawMode = (get("mode") ?? "STANDARD").toUpperCase();
  const mode = (MODES.includes(rawMode as SessionMode) ? rawMode : "STANDARD") as SessionMode;

  return <SessionRunner conceptId={conceptId} type={type} mode={mode} />;
}
