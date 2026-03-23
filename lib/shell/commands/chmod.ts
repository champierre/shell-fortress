import { CommandHandler } from ".";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const chmod: CommandHandler = (args, state) => {
  if (args.length < 2) {
    return { output: "", error: "chmod: missing operand" };
  }

  const permissions = args[0];
  const targetPath = resolvePath(state.currentPath, args[1]);
  const node = getNodeAtPath(state.fileSystem, targetPath);

  if (!node) {
    return { output: "", error: `chmod: cannot access '${args[1]}': No such file or directory` };
  }

  return {
    output: "",
    sideEffects: [{ type: "chmod", path: targetPath, permissions }],
  };
};
