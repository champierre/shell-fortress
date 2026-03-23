import { CommandHandler } from ".";
import { isDirectory } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const cd: CommandHandler = (args, state) => {
  if (args.length === 0) {
    return {
      output: "",
      sideEffects: [{ type: "changeDirectory", path: "/" }],
    };
  }

  const targetPath = resolvePath(state.currentPath, args[0]);
  const node = getNodeAtPath(state.fileSystem, targetPath);

  if (!node) {
    return { output: "", error: `cd: no such directory: ${args[0]}` };
  }

  if (!isDirectory(node)) {
    return { output: "", error: `cd: not a directory: ${args[0]}` };
  }

  return {
    output: "",
    sideEffects: [{ type: "changeDirectory", path: targetPath }],
  };
};
