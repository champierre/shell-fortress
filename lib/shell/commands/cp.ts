import { CommandHandler } from ".";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const cp: CommandHandler = (args, state) => {
  const nonFlagArgs = args.filter((a) => !a.startsWith("-"));

  if (nonFlagArgs.length < 2) {
    return { output: "", error: "cp: missing destination" };
  }

  const fromPath = resolvePath(state.currentPath, nonFlagArgs[0]);
  const toPath = resolvePath(state.currentPath, nonFlagArgs[1]);

  const node = getNodeAtPath(state.fileSystem, fromPath);
  if (!node) {
    return { output: "", error: `cp: cannot stat '${nonFlagArgs[0]}': No such file or directory` };
  }

  return {
    output: "",
    sideEffects: [{ type: "copyNode", from: fromPath, to: toPath }],
  };
};
