// ===== Virtual Filesystem =====
export interface VFSFile {
  name: string;
  content: string;
  permissions: string; // e.g. "rwx", "r--"
}

export interface VFSDirectory {
  name: string;
  children: Record<string, VFSNode>;
  permissions: string;
}

export type VFSNode = VFSFile | VFSDirectory;

export function isDirectory(node: VFSNode): node is VFSDirectory {
  return "children" in node;
}

export function isFile(node: VFSNode): node is VFSFile {
  return "content" in node;
}

// ===== Process Table =====
export interface GameProcess {
  pid: number;
  name: string;
  status: "running" | "stopped" | "zombie";
  description: string;
  hostile: boolean;
  isBoss?: boolean;
}

// ===== Terminal =====
export interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  text: string;
}

// ===== Command System =====
export interface ParsedCommand {
  name: string;
  args: string[];
  raw: string;
}

export interface PipelineCommand {
  commands: ParsedCommand[];
}

export interface CommandResult {
  output: string;
  error?: string;
  sideEffects?: SideEffect[];
}

export type SideEffect =
  | { type: "changeDirectory"; path: string }
  | { type: "openDoor"; doorId: string }
  | { type: "repairSystem"; systemId: string }
  | { type: "killProcess"; pid: number }
  | { type: "stageComplete" }
  | { type: "conveyorUpdate"; data: string[] }
  | { type: "penalty"; message: string }
  | { type: "createDirectory"; path: string }
  | { type: "removeNode"; path: string }
  | { type: "copyNode"; from: string; to: string }
  | { type: "moveNode"; from: string; to: string }
  | { type: "chmod"; path: string; permissions: string }
  | { type: "sudo"; enabled: boolean };

// ===== Stage =====
export type StageStatus = "locked" | "unlocked" | "completed";

export interface StageObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface StageDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  commands: string[];
  objectives: StageObjective[];
  initialFileSystem: VFSDirectory;
  initialProcesses?: GameProcess[];
  hints: string[];
  missionBriefing: string;
  checkCompletion: (state: StageState) => boolean;
}

export interface StageState {
  stageId: string;
  fileSystem: VFSDirectory;
  currentPath: string;
  processes: GameProcess[];
  terminalHistory: TerminalLine[];
  objectives: StageObjective[];
  doors: Record<string, boolean>;
  systems: Record<string, boolean>;
  conveyorData?: string[];
  conveyorTarget?: string[];
  hintsUsed: number;
  commandsUsed: string[];
  sudoEnabled: boolean;
  completed: boolean;
  startTime: number;
}

// ===== Game State =====
export interface GameProgress {
  stagesCompleted: string[];
  stagesUnlocked: string[];
  learnedCommands: string[];
  totalCommandsUsed: number;
}

export interface StageResult {
  stageId: string;
  completed: boolean;
  commandsUsed: number;
  hintsUsed: number;
  timeSeconds: number;
  newCommandsLearned: string[];
}
