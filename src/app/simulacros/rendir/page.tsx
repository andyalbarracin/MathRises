import { MockRunner } from "@/components/mock/mock-runner";

export default async function RendirPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const examId = typeof sp.exam === "string" ? sp.exam : "matematica";
  return <MockRunner examId={examId} />;
}
