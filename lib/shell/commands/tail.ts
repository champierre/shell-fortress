import { CommandHandler } from ".";
import { isFile } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const tail: CommandHandler = (args, state, pipeInput) => {
  let count = 10;
  const nonFlagArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-n" && args[i + 1]) {
      count = parseInt(args[i + 1], 10);
      i++;
    } else if (!args[i].startsWith("-")) {
      nonFlagArgs.push(args[i]);
    }
  }

  let input: string;

  if (pipeInput !== undefined) {
    input = pipeInput;
  } else if (nonFlagArgs.length >= 1) {
    const filePath = resolvePath(state.currentPath, nonFlagArgs[0]);
    const node = getNodeAtPath(state.fileSystem, filePath);
    if (!node) return { output: "", error: `tail: ${nonFlagArgs[0]}: No such file or directory` };
    if (!isFile(node)) return { output: "", error: `tail: ${nonFlagArgs[0]}: Is a directory` };
    input = node.content;
  } else {
    return { output: "", error: "tail: missing file operand" };
  }

  const lines = input.split("\n");
  return { output: lines.slice(-count).join("\n") };
};
