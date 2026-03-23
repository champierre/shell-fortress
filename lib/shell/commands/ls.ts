import { CommandHandler } from ".";
import { isDirectory } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const ls: CommandHandler = (args, state) => {
  const showAll = args.includes("-a");
  const showLong = args.includes("-l");
  const targetArgs = args.filter((a) => !a.startsWith("-"));
  const targetPath = targetArgs[0]
    ? resolvePath(state.currentPath, targetArgs[0])
    : state.currentPath;

  const node = getNodeAtPath(state.fileSystem, targetPath);

  if (!node) {
    return { output: "", error: `ls: cannot access '${targetArgs[0] || targetPath}': No such file or directory` };
  }

  if (!isDirectory(node)) {
    if (showLong) {
      return { output: `-${node.permissions}  ${node.name}` };
    }
    return { output: node.name };
  }

  const entries = Object.values(node.children);
  const filtered = showAll ? entries : entries.filter((e) => !e.name.startsWith("."));

  if (filtered.length === 0) {
    return { output: "" };
  }

  if (showLong) {
    const lines = filtered.map((entry) => {
      const typeChar = isDirectory(entry) ? "d" : "-";
      return `${typeChar}${entry.permissions}  ${entry.name}`;
    });
    return { output: lines.join("\n") };
  }

  return { output: filtered.map((e) => e.name).join("  ") };
};
