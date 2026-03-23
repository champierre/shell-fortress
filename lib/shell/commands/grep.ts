import { CommandHandler } from ".";
import { isFile } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const grep: CommandHandler = (args, state, pipeInput) => {
  const flags: string[] = [];
  const nonFlagArgs: string[] = [];

  for (const arg of args) {
    if (arg.startsWith("-")) {
      flags.push(arg);
    } else {
      nonFlagArgs.push(arg);
    }
  }

  const ignoreCase = flags.includes("-i");
  const invertMatch = flags.includes("-v");
  const countOnly = flags.includes("-c");

  if (nonFlagArgs.length === 0) {
    return { output: "", error: "grep: missing pattern" };
  }

  const pattern = nonFlagArgs[0];
  let input: string;

  if (pipeInput !== undefined) {
    input = pipeInput;
  } else if (nonFlagArgs.length >= 2) {
    const filePath = resolvePath(state.currentPath, nonFlagArgs[1]);
    const node = getNodeAtPath(state.fileSystem, filePath);

    if (!node) {
      return { output: "", error: `grep: ${nonFlagArgs[1]}: No such file or directory` };
    }
    if (!isFile(node)) {
      return { output: "", error: `grep: ${nonFlagArgs[1]}: Is a directory` };
    }

    input = node.content;
  } else {
    return { output: "", error: "grep: missing file operand" };
  }

  const lines = input.split("\n");
  const matched = lines.filter((line) => {
    const haystack = ignoreCase ? line.toLowerCase() : line;
    const needle = ignoreCase ? pattern.toLowerCase() : pattern;
    const matches = haystack.includes(needle);
    return invertMatch ? !matches : matches;
  });

  if (countOnly) {
    return { output: String(matched.length) };
  }

  return { output: matched.join("\n") };
};
