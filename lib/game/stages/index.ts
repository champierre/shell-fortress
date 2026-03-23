import { StageDefinition } from "@/types";
import { stage1 } from "./stage-1";
import { stage2 } from "./stage-2";
import { stage3 } from "./stage-3";
import { stage4 } from "./stage-4";

const stages: Record<string, StageDefinition> = {
  "stage-1": stage1,
  "stage-2": stage2,
  "stage-3": stage3,
  "stage-4": stage4,
};

export function getStageDefinition(id: string): StageDefinition | undefined {
  return stages[id];
}

export function getAllStages(): StageDefinition[] {
  return Object.values(stages);
}

export const STAGE_IDS = ["stage-1", "stage-2", "stage-3", "stage-4"];
