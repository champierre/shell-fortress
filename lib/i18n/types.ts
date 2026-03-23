export type Locale = "en" | "ja";

export interface UITranslations {
  title: string;
  subtitle: string;
  bootMessage: string;
  startMission: string;
  browserGame: string;
  stageSelect: string;
  back: string;
  cleared: string;
  commandsLearned: string;
  totalCommandsUsed: string;
  stage: string;
  locked: string;

  // Stage gameplay
  location: string;
  sectorMap: string;
  activeProcesses: string;
  emptyRoom: string;
  parent: string;
  directory: string;
  file: string;
  objectives: string;
  commandsUsed: string;
  noCommandsYet: string;
  hint: string;
  reset: string;

  // Terminal
  terminalPath: string;
  typeCommand: string;
  stageCompleteInput: string;

  // Stage complete
  stageClear: string;
  missionAccomplished: string;
  time: string;
  cmdsUsed: string;
  hintsUsed: string;
  newCommandsLearned: string;
  stageSelectButton: string;
  nextStage: string;
  backToMenu: string;

  // Top bar
  exit: string;
  cmds: string;

  // Loading
  loading: string;

  // Shell messages
  helpHeader: string;
  availableCommands: string;
  typeHelp: string;
  stageComplete: string;

  // Kill messages
  terminatingHostile: string;
  processTerminated: string;
  wrongTarget: string;

  // Sudo
  sudoAlreadyElevated: string;
  sudoGranted: string;
}

export interface StageTranslations {
  name: string;
  subtitle: string;
  description: string;
  missionBriefing: string;
  objectives: { id: string; description: string }[];
  hints: string[];
  fileContents?: Record<string, string>;
}
