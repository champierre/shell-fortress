import { CommandHandler } from ".";
import { isDirectory } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const rm: CommandHandler = (args, state) => {
  const recursive = args.includes("-r") || args.includes("-rf");
  const nonFlagArgs = args.filter((a) => !a.startsWith("-"));

  if (nonFlagArgs.length === 0) {
    return { output: "", error: "rm: missing operand" };
  }

  const targetPath = resolvePath(state.currentPath, nonFlagArgs[0]);
  const node = getNodeAtPath(state.fileSystem, targetPath);

  if (!node) {
    return { output: "", error: `rm: cannot remove '${nonFlagArgs[0]}': No such file or directory` };
  }

  if (isDirectory(node) && !recursive) {
    return { output: "", error: `rm: cannot remove '${nonFlagArgs[0]}': Is a directory (use -r)` };
  }

  return {
    output: "",
    sideEffects: [{ type: "removeNode", path: targetPath }],
  };
};
