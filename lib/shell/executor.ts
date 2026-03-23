import { CommandResult, SideEffect, StageState } from "@/types";
import { parsePipeline } from "./parser";
import { getCommand } from "./commands";

export function executeInput(
  input: string,
  state: StageState
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: "" };
  }

  const pipeline = parsePipeline(trimmed);

  if (pipeline.commands.length === 0) {
    return { output: "" };
  }

  let pipeData: string | undefined;
  const allSideEffects: SideEffect[] = [];

  for (let i = 0; i < pipeline.commands.length; i++) {
    const cmd = pipeline.commands[i];
    const handler = getCommand(cmd.name);

    if (!handler) {
      return {
        output: "",
        error: `${cmd.name}: command not found. Type 'help' for available commands.`,
      };
    }

    const result = handler(cmd.args, state, pipeData);

    if (result.error) {
      return result;
    }

    if (result.sideEffects) {
      allSideEffects.push(...result.sideEffects);
    }

    pipeData = result.output;
  }

  return {
    output: pipeData || "",
    sideEffects: allSideEffects.length > 0 ? allSideEffects : undefined,
  };
}
