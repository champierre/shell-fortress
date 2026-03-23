import { CommandHandler } from ".";
import { VFSDirectory, VFSNode, isDirectory } from "@/types";
import { resolvePath, getNodeAtPath } from "./filesystem-utils";

export const find: CommandHandler = (args, state) => {
  let searchPath = state.currentPath;
  let namePattern = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-name" && args[i + 1]) {
      namePattern = args[i + 1];
      i++;
    } else if (!args[i].startsWith("-")) {
      searchPath = resolvePath(state.currentPath, args[i]);
    }
  }

  const node = getNodeAtPath(state.fileSystem, searchPath);
  if (!node || !isDirectory(node)) {
    return { output: "", error: `find: '${searchPath}': No such directory` };
  }

  const results: string[] = [];
  walkDirectory(node, searchPath, namePattern, results);

  return { output: results.join("\n") };
};

function walkDirectory(
  dir: VFSDirectory,
  path: string,
  namePattern: string,
  results: string[]
) {
  for (const [name, child] of Object.entries(dir.children)) {
    const childPath = path === "/" ? `/${name}` : `${path}/${name}`;

    if (!namePattern || matchWildcard(name, namePattern)) {
      results.push(childPath);
    }

    if (isDirectory(child)) {
      walkDirectory(child as VFSDirectory, childPath, namePattern, results);
    }
  }
}

function matchWildcard(text: string, pattern: string): boolean {
  const regex = new RegExp(
    "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$"
  );
  return regex.test(text);
}
