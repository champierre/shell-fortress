import { CommandHandler } from ".";
import { isFile } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const wc: CommandHandler = (args, state, pipeInput) => {
  const linesOnly = args.includes("-l");
  const wordsOnly = args.includes("-w");
  const nonFlagArgs = args.filter((a) => !a.startsWith("-"));

  let input: string;
  let fileName = "";

  if (pipeInput !== undefined) {
    input = pipeInput;
  } else if (nonFlagArgs.length >= 1) {
    fileName = nonFlagArgs[0];
    const filePath = resolvePath(state.currentPath, fileName);
    const node = getNodeAtPath(state.fileSystem, filePath);
    if (!node) return { output: "", error: `wc: ${fileName}: No such file or directory` };
    if (!isFile(node)) return { output: "", error: `wc: ${fileName}: Is a directory` };
    input = node.content;
  } else {
    return { output: "", error: "wc: missing file operand" };
  }

  const lines = input.split("\n").length;
  const words = input.split(/\s+/).filter(Boolean).length;
  const chars = input.length;

  const suffix = fileName ? ` ${fileName}` : "";

  if (linesOnly) return { output: `${lines}${suffix}` };
  if (wordsOnly) return { output: `${words}${suffix}` };

  return { output: `${lines} ${words} ${chars}${suffix}` };
};
