import { UITranslations, StageTranslations } from "./types";

export const ui: UITranslations = {
  title: "SHELL FORTRESS",
  subtitle: "Learn Linux commands by exploring a malfunctioning space fortress.",
  bootMessage: "SYSTEM BOOT SEQUENCE INITIATED",
  startMission: "> START MISSION",
  browserGame: "A browser-based learning game",
  stageSelect: "STAGE SELECT",
  back: "← Back",
  cleared: "cleared",
  commandsLearned: "Commands learned",
  totalCommandsUsed: "Total commands used",
  stage: "Stage",
  locked: "Locked",

  location: "LOCATION",
  sectorMap: "SECTOR MAP",
  activeProcesses: "ACTIVE PROCESSES",
  emptyRoom: "Empty room",
  parent: "parent",
  directory: "directory",
  file: "file",
  objectives: "OBJECTIVES",
  commandsUsed: "COMMANDS USED",
  noCommandsYet: "No commands used yet",
  hint: "Hint",
  reset: "Reset",

  terminalPath: "fortress-terminal",
  typeCommand: "Type a command...",
  stageCompleteInput: "Stage complete!",

  stageClear: "STAGE CLEAR",
  missionAccomplished: "Mission accomplished, operator.",
  time: "Time",
  cmdsUsed: "Commands Used",
  hintsUsed: "Hints Used",
  newCommandsLearned: "NEW COMMANDS LEARNED",
  stageSelectButton: "Stage Select",
  nextStage: "Next Stage →",
  backToMenu: "Back to Menu",

  exit: "← Exit",
  cmds: "cmds",
  loading: "Loading fortress systems...",

  helpHeader: "Shell Fortress Terminal v1.0",
  availableCommands: "Available commands in this stage",
  typeHelp: 'Type "help" for assistance.',
  stageComplete: "STAGE COMPLETE! All objectives achieved.",

  terminatingHostile: "Terminating hostile process",
  processTerminated: "terminated",
  wrongTarget: "Wrong target! was a friendly process.",

  sudoAlreadyElevated: "sudo: already elevated.",
  sudoGranted: "[SUDO] Elevated privileges granted for this session.",
};

export const stages: Record<string, StageTranslations> = {
  "stage-1": {
    name: "Navigation Sector",
    subtitle: "Learn to navigate the fortress",
    description:
      "The fortress entrance. Each room is a directory. Use terminal commands to find your way to the exit.",
    missionBriefing:
      "You've breached the fortress outer hull. Navigate through the directory structure to reach the exit. Use pwd, ls, and cd to explore.",
    objectives: [
      { id: "find-map", description: "Use 'ls' to discover the rooms in the fortress" },
      { id: "navigate-corridor", description: "Navigate to the east-corridor using 'cd'" },
      { id: "reach-exit", description: "Find and reach the exit room" },
    ],
    hints: [
      "Try typing 'ls' to see what's in the current directory.",
      "Use 'cd <dirname>' to enter a room. Try 'cd east-corridor'.",
      "The exit is inside the east-corridor. Use 'ls' there, then 'cd' to the exit.",
      "Full path: cd east-corridor, then cd control-room, then cd exit",
    ],
    fileContents: {
      "readme.txt":
        "FORTRESS NAVIGATION SYSTEM v2.1\nUse 'ls' to list rooms.\nUse 'cd <room>' to enter a room.\nUse 'pwd' to see your current location.\nFind the exit to proceed.",
      "supplies.txt": "Emergency rations: 12\nOxygen tanks: 4\nRepair kits: 2",
      "warning.txt": "⚠ This corridor has been sealed. Turn back.",
      "view.txt":
        "Through the viewport you see the vastness of space. The fortress orbits a dying star.",
      "terminal-log.txt": "Last access: 2187-03-14\nStatus: EXIT door is through this room.",
      "access-granted.txt": "EXIT UNLOCKED. You have navigated the sector successfully.",
    },
  },
  "stage-2": {
    name: "Repair Bay",
    subtitle: "Inspect logs and repair systems",
    description:
      "The life support system is failing. Examine log files to find the error code and repair the system.",
    missionBriefing:
      "Life support is failing! Examine the log files in the repair bay to find the error source and obtain the repair code. Use cat, grep, and tail to analyze the data.",
    objectives: [
      { id: "read-logs", description: "Use 'cat' to read the system status file" },
      { id: "find-error", description: "Use 'grep' to find the ERROR entries in the logs" },
      { id: "find-repair-code", description: "Use 'tail' to find the latest repair code in recent logs" },
    ],
    hints: [
      "Start by typing 'ls' to see what files are available.",
      "Use 'cat status.txt' to read the system status.",
      "Use 'grep ERROR system-log.txt' to find error entries.",
      "Use 'tail -n 3 repair-codes.txt' to see the latest repair codes. The answer is the last code.",
    ],
    fileContents: {
      "status.txt":
        "=== FORTRESS REPAIR BAY ===\nLife Support: CRITICAL\nEngine: ONLINE\nShields: ONLINE\nComms: OFFLINE\n\nWARNING: Life support failure detected.\nCheck system-log.txt for details.\nRepair code needed from repair-codes.txt",
      "module-report.txt":
        "Module LS-07 Report:\nType: Oxygen Recycler\nLocation: Sector 7, Bay 3\nStatus: FAILED\nLast maintenance: 2187-02-28\nRepair difficulty: MODERATE",
    },
  },
  "stage-3": {
    name: "Data Conveyor",
    subtitle: "Master pipelines and text processing",
    description:
      "Data packets flow through a corrupted conveyor. Build pipelines to filter and sort the data to match the target output.",
    missionBriefing:
      "The data conveyor is jammed with corrupted cargo manifests. Build a pipeline to filter, sort, and deduplicate the data. Your output must match the target manifest exactly.",
    objectives: [
      { id: "filter-data", description: "Use a pipeline with grep to filter the cargo data" },
      { id: "sort-unique", description: "Build a pipeline with sort and uniq to deduplicate results" },
      { id: "match-target", description: "Produce output that exactly matches the target manifest" },
    ],
    hints: [
      "Start with 'cat cargo-data.txt' to see the raw data.",
      "Check 'cat target-manifest.txt' to see what the final output should be.",
      "Use 'cat cargo-data.txt | grep PRIORITY' to filter priority items.",
      "Full solution: cat cargo-data.txt | grep PRIORITY | sort | uniq",
    ],
    fileContents: {
      "instructions.txt":
        "CONVEYOR SYSTEM MANUAL\n\nTo repair the conveyor, produce a clean manifest.\n1. Read the cargo data (cat)\n2. Filter for PRIORITY items only (grep)\n3. Sort the results (sort)\n4. Remove duplicates (uniq)\n5. Compare with target-manifest.txt\n\nPipelines connect commands with the | symbol.\nExample: cat file.txt | grep pattern | sort",
    },
  },
  "stage-4": {
    name: "Rogue Process",
    subtitle: "Mini-boss — Terminate the hostile process",
    description:
      "A rogue AI process has taken control of the defense drones. Find and kill the correct process to disable them.",
    missionBriefing:
      "ALERT: Defense drones have been hijacked by a rogue process! Inspect the process table, gather intel, and terminate the correct process. Be careful — killing the wrong one has consequences!",
    objectives: [
      { id: "inspect-processes", description: "Use 'ps' to view running processes" },
      { id: "identify-threat", description: "Read intel files to identify the hostile process" },
      { id: "kill-boss", description: "Use 'kill' with the correct PID to terminate the rogue process" },
    ],
    hints: [
      "Type 'ps' to see all running processes and their PIDs.",
      "Use 'ls' and 'cat' to read intel files about the rogue process.",
      "Read intel/threat-analysis.txt to find out which process is the boss.",
      "The rogue process is 'DRONE-MASTER'. Find its PID with 'ps', then use 'kill <PID>'.",
    ],
    fileContents: {
      "process-manual.txt":
        "FORTRESS PROCESS MANAGEMENT MANUAL\n\nCommands:\n  ps       - List all running processes\n  kill PID - Terminate a process by its PID number\n\nTips:\n  - Always verify the PID before killing a process\n  - System-critical processes should not be terminated\n  - Check intel reports before taking action",
      "threat-analysis.txt":
        "=== THREAT ANALYSIS REPORT ===\n\nAt 0800 hours, defense drones began erratic behavior.\nRoot cause: unauthorized process 'DRONE-MASTER' (PID 256)\nThis process is issuing commands to drone relays.\n\nRECOMMENDATION: Terminate DRONE-MASTER to disable all drones.\nWARNING: Do NOT kill fortress-core or life-support!\n\nRelay processes will shut down automatically once\nthe master process is terminated.",
      "drone-log.txt":
        "[08:00] Drone patrol initialized\n[08:05] DRONE-MASTER override detected\n[08:06] Drones rerouted to hostile patrol pattern\n[08:10] Warning: weapons armed on all drones\n[08:15] Manual override attempted — DENIED\n[08:20] DRONE-MASTER rejecting all standard kill signals",
    },
  },
};
