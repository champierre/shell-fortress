import { CommandHandler } from ".";
import { resolvePath, getNodeAtPath, getParentAndName } from "./filesystem-utils";

export const mkdir: CommandHandler = (args, state) => {
  if (args.length === 0) {
    return { output: "", error: "mkdir: missing operand" };
  }

  const targetPath = resolvePath(state.currentPath, args[0]);
  const existing = getNodeAtPath(state.fileSystem, targetPath);
  if (existing) {
    return { output: "", error: `mkdir: cannot create directory '${args[0]}': File exists` };
  }

  const parentInfo = getParentAndName(state.fileSystem, targetPath);
  if (!parentInfo) {
    return { output: "", error: `mkdir: cannot create directory '${args[0]}': No such file or directory` };
  }

  return {
    output: "",
    sideEffects: [{ type: "createDirectory", path: targetPath }],
  };
};
