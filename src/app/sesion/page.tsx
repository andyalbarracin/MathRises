import { SessionRunner } from "@/components/session/session-runner";
import type { SessionMode } from "@/domain/types";

const VALID: SessionMode[] = ["QUICK", "STANDARD", "DEEP"];

export default async function SesionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = typeof sp.mode === "string" ? sp.mode.toUpperCase() : "STANDARD";
  const mode = (VALID.includes(raw as SessionMode) ? raw : "STANDARD") as SessionMode;
  return <SessionRunner mode={mode} />;
}
