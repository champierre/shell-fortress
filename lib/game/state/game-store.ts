"use client";

import { create } from "zustand";
import {
  GameProgress,
  StageState,
  StageResult,
  TerminalLine,
  SideEffect,
  VFSNode,
  isFile,
  isDirectory,
} from "@/types";
import { executeInput } from "@/lib/shell/executor";
import { getStageDefinition } from "@/lib/game/stages";
import { getNodeAtPath, getParentAndName } from "@/lib/shell/commands/filesystem-utils";
import { Locale, getUI, getStageTranslation } from "@/lib/i18n";

interface GameStore {
  progress: GameProgress;
  stageState: StageState | null;
  locale: Locale;

  setLocale: (locale: Locale) => void;
  loadStage: (stageId: string, locale?: Locale) => void;
  executeCommand: (input: string) => void;
  useHint: () => string | null;
  resetStage: () => void;
  completeStage: () => StageResult | null;
  loadProgress: () => void;
  saveProgress: () => void;
}

const STORAGE_KEY = "shell-fortress-progress";

const defaultProgress: GameProgress = {
  stagesCompleted: [],
  stagesUnlocked: ["stage-1"],
  learnedCommands: [],
  totalCommandsUsed: 0,
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Apply locale-specific file contents to a virtual filesystem
function applyLocalizedFileContents(
  node: VFSNode,
  fileContents: Record<string, string>
): void {
  if (isFile(node) && fileContents[node.name] !== undefined) {
    node.content = fileContents[node.name];
  }
  if (isDirectory(node)) {
    for (const child of Object.values(node.children)) {
      applyLocalizedFileContents(child, fileContents);
    }
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  progress: { ...defaultProgress },
  stageState: null,
  locale: "en",

  setLocale: (locale: Locale) => {
    set({ locale });
  },

  loadProgress: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameProgress;
        set({ progress: parsed });
      } catch {
        // ignore
      }
    }
  },

  saveProgress: () => {
    if (typeof window === "undefined") return;
    const { progress } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  },

  loadStage: (stageId: string, locale?: Locale) => {
    const definition = getStageDefinition(stageId);
    if (!definition) return;

    const currentLocale = locale || get().locale;
    const t = getUI(currentLocale);
    const stageT = getStageTranslation(currentLocale, stageId);

    // Use translated stage data if available, otherwise fall back to definition
    const stageName = stageT?.name || definition.name;
    const missionBriefing = stageT?.missionBriefing || definition.missionBriefing;
    const objectives = stageT?.objectives || definition.objectives;
    const hints = stageT?.hints || definition.hints;

    // Clone filesystem and apply localized file contents
    const fs = deepClone(definition.initialFileSystem);
    if (stageT?.fileContents) {
      applyLocalizedFileContents(fs, stageT.fileContents);
    }

    const stageState: StageState = {
      stageId,
      fileSystem: fs,
      currentPath: "/",
      processes: deepClone(definition.initialProcesses || []),
      terminalHistory: [
        { type: "system", text: `=== ${stageName} ===` },
        { type: "system", text: missionBriefing },
        { type: "system", text: `${t.availableCommands}: ${definition.commands.join(", ")}` },
        { type: "system", text: t.typeHelp },
      ],
      objectives: deepClone(objectives).map((o) => ({ ...o, completed: false })),
      doors: {},
      systems: {},
      hintsUsed: 0,
      commandsUsed: [],
      sudoEnabled: false,
      completed: false,
      startTime: Date.now(),
    };

    set({ stageState, locale: currentLocale });
  },

  executeCommand: (input: string) => {
    const { stageState, progress, locale } = get();
    if (!stageState || stageState.completed) return;

    const t = getUI(locale);

    const newHistory: TerminalLine[] = [
      ...stageState.terminalHistory,
      { type: "input" as const, text: `$ ${input}` },
    ];

    const result = executeInput(input, stageState);

    let updatedState = { ...stageState, terminalHistory: newHistory };

    if (result.output === "__CLEAR__") {
      set({ stageState: { ...updatedState, terminalHistory: [] } });
      return;
    }

    if (result.output) {
      updatedState.terminalHistory = [
        ...updatedState.terminalHistory,
        { type: "output" as const, text: result.output },
      ];
    }

    if (result.error) {
      updatedState.terminalHistory = [
        ...updatedState.terminalHistory,
        { type: "error" as const, text: result.error },
      ];
    }

    const cmdName = input.trim().split(/\s+/)[0];
    updatedState.commandsUsed = [...updatedState.commandsUsed, cmdName];

    if (result.sideEffects) {
      updatedState = applySideEffects(updatedState, result.sideEffects);
    }

    const definition = getStageDefinition(stageState.stageId);
    if (definition && definition.checkCompletion(updatedState)) {
      updatedState.completed = true;
      updatedState.terminalHistory = [
        ...updatedState.terminalHistory,
        { type: "system" as const, text: `🎉 ${t.stageComplete}` },
      ];
    }

    const newLearnedCommands = [...new Set([...progress.learnedCommands, cmdName])];

    set({
      stageState: updatedState,
      progress: {
        ...progress,
        learnedCommands: newLearnedCommands,
        totalCommandsUsed: progress.totalCommandsUsed + 1,
      },
    });
  },

  useHint: () => {
    const { stageState, locale } = get();
    if (!stageState) return null;

    const stageT = getStageTranslation(locale, stageState.stageId);
    const definition = getStageDefinition(stageState.stageId);
    if (!definition) return null;

    const hints = stageT?.hints || definition.hints;
    const hintIndex = stageState.hintsUsed;
    if (hintIndex >= hints.length) return null;

    const t = getUI(locale);
    const hint = hints[hintIndex];

    set({
      stageState: {
        ...stageState,
        hintsUsed: hintIndex + 1,
        terminalHistory: [
          ...stageState.terminalHistory,
          { type: "system" as const, text: `💡 ${t.hint}: ${hint}` },
        ],
      },
    });

    return hint;
  },

  resetStage: () => {
    const { stageState, locale } = get();
    if (!stageState) return;
    get().loadStage(stageState.stageId, locale);
  },

  completeStage: () => {
    const { stageState, progress } = get();
    if (!stageState || !stageState.completed) return null;

    const definition = getStageDefinition(stageState.stageId);
    if (!definition) return null;

    const result: StageResult = {
      stageId: stageState.stageId,
      completed: true,
      commandsUsed: stageState.commandsUsed.length,
      hintsUsed: stageState.hintsUsed,
      timeSeconds: Math.floor((Date.now() - stageState.startTime) / 1000),
      newCommandsLearned: definition.commands.filter(
        (c) => !progress.learnedCommands.includes(c)
      ),
    };

    const stageIds = ["stage-1", "stage-2", "stage-3", "stage-4"];
    const currentIndex = stageIds.indexOf(stageState.stageId);
    const nextStageId = stageIds[currentIndex + 1];

    const newProgress: GameProgress = {
      ...progress,
      stagesCompleted: [...new Set([...progress.stagesCompleted, stageState.stageId])],
      stagesUnlocked: nextStageId
        ? [...new Set([...progress.stagesUnlocked, nextStageId])]
        : progress.stagesUnlocked,
      learnedCommands: [
        ...new Set([...progress.learnedCommands, ...definition.commands]),
      ],
    };

    set({ progress: newProgress });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }

    return result;
  },
}));

function applySideEffects(state: StageState, effects: SideEffect[]): StageState {
  let s = { ...state };

  for (const effect of effects) {
    switch (effect.type) {
      case "changeDirectory": {
        s = { ...s, currentPath: effect.path };
        const doorId = `door-${effect.path}`;
        s = { ...s, doors: { ...s.doors, [doorId]: true } };
        break;
      }
      case "openDoor":
        s = { ...s, doors: { ...s.doors, [effect.doorId]: true } };
        break;
      case "repairSystem":
        s = { ...s, systems: { ...s.systems, [effect.systemId]: true } };
        break;
      case "killProcess":
        s = { ...s, processes: s.processes.filter((p) => p.pid !== effect.pid) };
        break;
      case "stageComplete":
        s = { ...s, completed: true };
        break;
      case "conveyorUpdate":
        s = { ...s, conveyorData: effect.data };
        break;
      case "penalty":
        s = {
          ...s,
          terminalHistory: [
            ...s.terminalHistory,
            { type: "error" as const, text: `⚠️ ${effect.message}` },
          ],
        };
        break;
      case "createDirectory": {
        const fs = deepClone(s.fileSystem);
        const info = getParentAndName(fs, effect.path);
        if (info) {
          info.parent.children[info.name] = {
            name: info.name,
            children: {},
            permissions: "rwx",
          };
          s = { ...s, fileSystem: fs };
        }
        break;
      }
      case "removeNode": {
        const fs = deepClone(s.fileSystem);
        const info = getParentAndName(fs, effect.path);
        if (info) {
          delete info.parent.children[info.name];
          s = { ...s, fileSystem: fs };
        }
        break;
      }
      case "copyNode": {
        const fs = deepClone(s.fileSystem);
        const srcNode = getNodeAtPath(fs, effect.from);
        const destInfo = getParentAndName(fs, effect.to);
        if (srcNode && destInfo) {
          destInfo.parent.children[destInfo.name] = deepClone(srcNode);
          s = { ...s, fileSystem: fs };
        }
        break;
      }
      case "moveNode": {
        const fs = deepClone(s.fileSystem);
        const srcNode = getNodeAtPath(fs, effect.from);
        const srcInfo = getParentAndName(fs, effect.from);
        const destInfo = getParentAndName(fs, effect.to);
        if (srcNode && srcInfo && destInfo) {
          destInfo.parent.children[destInfo.name] = deepClone(srcNode);
          delete srcInfo.parent.children[srcInfo.name];
          s = { ...s, fileSystem: fs };
        }
        break;
      }
      case "chmod": {
        const fs = deepClone(s.fileSystem);
        const node = getNodeAtPath(fs, effect.path);
        if (node) {
          node.permissions = effect.permissions;
          s = { ...s, fileSystem: fs };
        }
        break;
      }
      case "sudo":
        s = { ...s, sudoEnabled: effect.enabled };
        break;
    }
  }

  return s;
}
