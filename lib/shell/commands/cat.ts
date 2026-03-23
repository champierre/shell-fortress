import { CommandHandler } from ".";
import { isFile } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const cat: CommandHandler = (args, state, pipeInput) => {
  if (pipeInput !== undefined && args.length === 0) {
    return { output: pipeInput };
  }

  if (args.length === 0) {
    return { output: "", error: "cat: missing file operand" };
  }

  const outputs: string[] = [];

  for (const arg of args) {
    const path = resolvePath(state.currentPath, arg);
    const node = getNodeAtPath(state.fileSystem, path);

    if (!node) {
      return { output: "", error: `cat: ${arg}: No such file or directory` };
    }

    if (!isFile(node)) {
      return { output: "", error: `cat: ${arg}: Is a directory` };
    }

    outputs.push(node.content);
  }

  return { output: outputs.join("\n") };
};
