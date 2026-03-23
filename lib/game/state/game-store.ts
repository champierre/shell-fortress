"use client";

import { create } from "zustand";
import {
  GameProgress,
  StageState,
  StageResult,
  TerminalLine,
  VFSDirectory,
  SideEffect,
  isDirectory,
} from "@/types";
import { executeInput } from "@/lib/shell/executor";
import { getStageDefinition } from "@/lib/game/stages";
import { getNodeAtPath, getParentAndName } from "@/lib/shell/commands/filesystem-utils";

interface GameStore {
  // Progress
  progress: GameProgress;

  // Current stage state
  stageState: StageState | null;

  // Actions
  loadStage: (stageId: string) => void;
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

export const useGameStore = create<GameStore>((set, get) => ({
  progress: { ...defaultProgress },
  stageState: null,

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

  loadStage: (stageId: string) => {
    const definition = getStageDefinition(stageId);
    if (!definition) return;

    const stageState: StageState = {
      stageId,
      fileSystem: deepClone(definition.initialFileSystem),
      currentPath: "/",
      processes: deepClone(definition.initialProcesses || []),
      terminalHistory: [
        {
          type: "system",
          text: `=== ${definition.name} ===`,
        },
        {
          type: "system",
          text: definition.missionBriefing,
        },
        {
          type: "system",
          text: `Available commands: ${definition.commands.join(", ")}`,
        },
        {
          type: "system",
          text: 'Type "help" for assistance.',
        },
      ],
      objectives: deepClone(definition.objectives),
      doors: {},
      systems: {},
      hintsUsed: 0,
      commandsUsed: [],
      sudoEnabled: false,
      completed: false,
      startTime: Date.now(),
    };

    set({ stageState });
  },

  executeCommand: (input: string) => {
    const { stageState, progress } = get();
    if (!stageState || stageState.completed) return;

    const newHistory: TerminalLine[] = [
      ...stageState.terminalHistory,
      { type: "input" as const, text: `$ ${input}` },
    ];

    const result = executeInput(input, stageState);

    let updatedState = { ...stageState, terminalHistory: newHistory };

    // Handle clear command
    if (result.output === "__CLEAR__") {
      set({
        stageState: {
          ...updatedState,
          terminalHistory: [],
        },
      });
      return;
    }

    // Add output to terminal
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

    // Track command usage
    const cmdName = input.trim().split(/\s+/)[0];
    updatedState.commandsUsed = [...updatedState.commandsUsed, cmdName];

    // Process side effects
    if (result.sideEffects) {
      updatedState = applySideEffects(updatedState, result.sideEffects);
    }

    // Check stage completion
    const definition = getStageDefinition(stageState.stageId);
    if (definition && definition.checkCompletion(updatedState)) {
      updatedState.completed = true;
      updatedState.terminalHistory = [
        ...updatedState.terminalHistory,
        {
          type: "system" as const,
          text: "🎉 STAGE COMPLETE! All objectives achieved.",
        },
      ];
    }

    // Update learned commands
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
    const { stageState } = get();
    if (!stageState) return null;

    const definition = getStageDefinition(stageState.stageId);
    if (!definition) return null;

    const hintIndex = stageState.hintsUsed;
    if (hintIndex >= definition.hints.length) return null;

    const hint = definition.hints[hintIndex];

    set({
      stageState: {
        ...stageState,
        hintsUsed: hintIndex + 1,
        terminalHistory: [
          ...stageState.terminalHistory,
          { type: "system" as const, text: `💡 Hint: ${hint}` },
        ],
      },
    });

    return hint;
  },

  resetStage: () => {
    const { stageState } = get();
    if (!stageState) return;
    get().loadStage(stageState.stageId);
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

    // Unlock next stage
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

    // Save
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
        // Check if entering a new directory opens a door
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
        s = {
          ...s,
          processes: s.processes.filter((p) => p.pid !== effect.pid),
        };
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

function deepCloneFS<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
