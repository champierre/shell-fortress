import { CommandResult, StageState } from "@/types";
import { pwd } from "./pwd";
import { ls } from "./ls";
import { cd } from "./cd";
import { cat } from "./cat";
import { grep } from "./grep";
import { head } from "./head";
import { tail } from "./tail";
import { sort } from "./sort";
import { uniq } from "./uniq";
import { wc } from "./wc";
import { find } from "./find";
import { ps } from "./ps";
import { kill } from "./kill";
import { mkdir } from "./mkdir";
import { rm } from "./rm";
import { cp } from "./cp";
import { mv } from "./mv";
import { chmod } from "./chmod";
import { sudo } from "./sudo";

export type CommandHandler = (
  args: string[],
  state: StageState,
  pipeInput?: string
) => CommandResult;

const commandRegistry: Record<string, CommandHandler> = {
  pwd,
  ls,
  cd,
  cat,
  grep,
  head,
  tail,
  sort,
  uniq,
  wc,
  find,
  ps,
  kill,
  mkdir,
  rm,
  cp,
  mv,
  chmod,
  sudo,
  help: (_args, state) => {
    const available = state.objectives.length > 0
      ? "Available commands in this stage: " + getStageCommands(state.stageId).join(", ")
      : "No stage loaded.";
    return {
      output: `Shell Fortress Terminal v1.0\n${available}\nType a command to interact with the fortress systems.`,
    };
  },
  clear: () => ({ output: "__CLEAR__" }),
};

function getStageCommands(stageId: string): string[] {
  const stageCommandMap: Record<string, string[]> = {
    "stage-1": ["pwd", "ls", "cd", "help", "clear"],
    "stage-2": ["cat", "grep", "tail", "head", "pwd", "ls", "cd", "help", "clear"],
    "stage-3": ["cat", "grep", "sort", "uniq", "head", "tail", "wc", "help", "clear"],
    "stage-4": ["ps", "kill", "ls", "cat", "help", "clear"],
  };
  return stageCommandMap[stageId] || Object.keys(commandRegistry);
}

export function getCommand(name: string): CommandHandler | undefined {
  return commandRegistry[name];
}

export { commandRegistry };
