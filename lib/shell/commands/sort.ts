import { CommandHandler } from ".";
import { isFile } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const sort: CommandHandler = (args, state, pipeInput) => {
  const reverse = args.includes("-r");
  const nonFlagArgs = args.filter((a) => !a.startsWith("-"));

  let input: string;

  if (pipeInput !== undefined) {
    input = pipeInput;
  } else if (nonFlagArgs.length >= 1) {
    const filePath = resolvePath(state.currentPath, nonFlagArgs[0]);
    const node = getNodeAtPath(state.fileSystem, filePath);
    if (!node) return { output: "", error: `sort: ${nonFlagArgs[0]}: No such file or directory` };
    if (!isFile(node)) return { output: "", error: `sort: ${nonFlagArgs[0]}: Is a directory` };
    input = node.content;
  } else {
    return { output: "", error: "sort: missing file operand" };
  }

  const lines = input.split("\n").filter(Boolean);
  lines.sort();
  if (reverse) lines.reverse();

  return { output: lines.join("\n") };
};
