import { StageState, isDirectory } from "@/types";
import { commandRegistry } from "./commands";
import { resolvePath, getNodeAtPath } from "./commands/filesystem-utils";

export interface CompletionResult {
  completed: string;    // The full input with completion applied
  candidates: string[]; // All matching candidates (shown when multiple)
}

const STAGE_COMMANDS: Record<string, string[]> = {
  "stage-1": ["pwd", "ls", "cd", "help", "clear"],
  "stage-2": ["cat", "grep", "tail", "head", "pwd", "ls", "cd", "help", "clear"],
  "stage-3": ["cat", "grep", "sort", "uniq", "head", "tail", "wc", "help", "clear"],
  "stage-4": ["ps", "kill", "ls", "cat", "help", "clear"],
};

export function tabComplete(input: string, state: StageState): CompletionResult {
  if (!input) {
    return { completed: input, candidates: [] };
  }

  // Split into tokens, keeping track of what we're completing
  const parts = input.split(/\s+/);
  const isFirstToken = parts.length <= 1;
  const prefix = parts[parts.length - 1] || "";

  if (isFirstToken) {
    return completeCommand(prefix, state);
  }

  // For subsequent tokens, complete file/directory paths
  return completePath(input, prefix, state);
}

function completeCommand(prefix: string, state: StageState): CompletionResult {
  const available = STAGE_COMMANDS[state.stageId] || Object.keys(commandRegistry);
  const matches = available.filter((cmd) => cmd.startsWith(prefix));

  if (matches.length === 0) {
    return { completed: prefix, candidates: [] };
  }

  if (matches.length === 1) {
    return { completed: matches[0] + " ", candidates: [] };
  }

  // Complete to common prefix
  const common = commonPrefix(matches);
  return { completed: common, candidates: matches };
}

function completePath(fullInput: string, token: string, state: StageState): CompletionResult {
  const beforeToken = fullInput.slice(0, fullInput.length - token.length);

  // Split token into directory part and name prefix
  const lastSlash = token.lastIndexOf("/");
  let dirPart: string;
  let namePrefix: string;

  if (lastSlash >= 0) {
    dirPart = token.slice(0, lastSlash) || "/";
    namePrefix = token.slice(lastSlash + 1);
  } else {
    dirPart = state.currentPath;
    namePrefix = token;
  }

  const resolvedDir = resolvePath(state.currentPath, dirPart);
  const node = getNodeAtPath(state.fileSystem, resolvedDir);

  if (!node || !isDirectory(node)) {
    return { completed: fullInput, candidates: [] };
  }

  const entries = Object.keys(node.children);
  const matches = entries.filter((name) => name.startsWith(namePrefix));

  if (matches.length === 0) {
    return { completed: fullInput, candidates: [] };
  }

  const buildToken = (name: string) => {
    if (lastSlash >= 0) {
      return token.slice(0, lastSlash + 1) + name;
    }
    return name;
  };

  if (matches.length === 1) {
    const match = matches[0];
    const child = node.children[match];
    const suffix = isDirectory(child) ? "/" : " ";
    return {
      completed: beforeToken + buildToken(match) + suffix,
      candidates: [],
    };
  }

  // Complete to common prefix
  const common = commonPrefix(matches);
  return {
    completed: beforeToken + buildToken(common),
    candidates: matches,
  };
}

function commonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}
