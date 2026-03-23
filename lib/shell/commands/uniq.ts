import { CommandHandler } from ".";
import { isFile } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const uniq: CommandHandler = (args, state, pipeInput) => {
  const countMode = args.includes("-c");
  const nonFlagArgs = args.filter((a) => !a.startsWith("-"));

  let input: string;

  if (pipeInput !== undefined) {
    input = pipeInput;
  } else if (nonFlagArgs.length >= 1) {
    const filePath = resolvePath(state.currentPath, nonFlagArgs[0]);
    const node = getNodeAtPath(state.fileSystem, filePath);
    if (!node) return { output: "", error: `uniq: ${nonFlagArgs[0]}: No such file or directory` };
    if (!isFile(node)) return { output: "", error: `uniq: ${nonFlagArgs[0]}: Is a directory` };
    input = node.content;
  } else {
    return { output: "", error: "uniq: missing file operand" };
  }

  const lines = input.split("\n");
  const result: string[] = [];

  if (countMode) {
    let count = 1;
    for (let i = 1; i <= lines.length; i++) {
      if (i < lines.length && lines[i] === lines[i - 1]) {
        count++;
      } else {
        result.push(`${String(count).padStart(7)} ${lines[i - 1]}`);
        count = 1;
      }
    }
  } else {
    for (let i = 0; i < lines.length; i++) {
      if (i === 0 || lines[i] !== lines[i - 1]) {
        result.push(lines[i]);
      }
    }
  }

  return { output: result.join("\n") };
};
