import { STAGE_IDS } from "@/lib/game/stages";
import StageClient from "@/components/game/StageClient";

export function generateStaticParams() {
  return STAGE_IDS.map((id) => ({ id }));
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StageClient stageId={id} />;
}
