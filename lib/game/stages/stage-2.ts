import { StageDefinition } from "@/types";

export const stage2: StageDefinition = {
  id: "stage-2",
  name: "Repair Bay",
  subtitle: "Inspect logs and repair systems",
  description:
    "The life support system is failing. Examine log files to find the error code and repair the system.",
  commands: ["cat", "grep", "tail", "head", "ls", "cd", "pwd"],
  objectives: [
    {
      id: "read-logs",
      description: "Use 'cat' to read the system status file",
      completed: false,
    },
    {
      id: "find-error",
      description: "Use 'grep' to find the ERROR entries in the logs",
      completed: false,
    },
    {
      id: "find-repair-code",
      description: "Use 'tail' to find the latest repair code in recent logs",
      completed: false,
    },
  ],
  hints: [
    "Start by typing 'ls' to see what files are available.",
    "Use 'cat status.txt' to read the system status.",
    "Use 'grep ERROR system-log.txt' to find error entries.",
    "Use 'tail -n 3 repair-codes.txt' to see the latest repair codes. The answer is the last code.",
  ],
  missionBriefing:
    "Life support is failing! Examine the log files in the repair bay to find the error source and obtain the repair code. Use cat, grep, and tail to analyze the data.",
  initialFileSystem: {
    name: "/",
    permissions: "rwx",
    children: {
      "status.txt": {
        name: "status.txt",
        content:
          "=== FORTRESS REPAIR BAY ===\nLife Support: CRITICAL\nEngine: ONLINE\nShields: ONLINE\nComms: OFFLINE\n\nWARNING: Life support failure detected.\nCheck system-log.txt for details.\nRepair code needed from repair-codes.txt",
        permissions: "r--",
      },
      "system-log.txt": {
        name: "system-log.txt",
        content: [
          "[2187-03-14 08:00] INFO: System boot complete",
          "[2187-03-14 08:01] INFO: Engine nominal",
          "[2187-03-14 08:02] INFO: Shields activated",
          "[2187-03-14 08:05] WARNING: Temperature rising in sector 7",
          "[2187-03-14 08:10] ERROR: Life support module LS-07 malfunction",
          "[2187-03-14 08:11] INFO: Backup power engaged",
          "[2187-03-14 08:15] ERROR: Oxygen recycler failure in module LS-07",
          "[2187-03-14 08:20] INFO: Diagnostics running",
          "[2187-03-14 08:25] WARNING: Pressure drop detected",
          "[2187-03-14 08:30] ERROR: Critical failure in LS-07 — repair required",
          "[2187-03-14 08:35] INFO: Repair bay standing by",
        ].join("\n"),
        permissions: "r--",
      },
      "repair-codes.txt": {
        name: "repair-codes.txt",
        content: [
          "REPAIR-001: Engine recalibration (expired)",
          "REPAIR-002: Shield modulator (expired)",
          "REPAIR-003: Comms relay (expired)",
          "REPAIR-004: Navigation array (expired)",
          "REPAIR-005: Hull breach seal (expired)",
          "REPAIR-006: Gravity generator (expired)",
          "REPAIR-007: Coolant flush (expired)",
          "REPAIR-008: Power grid reset (expired)",
          "REPAIR-009: Sensor array tune (expired)",
          "REPAIR-010: LS-07 oxygen recycler (ACTIVE)",
        ].join("\n"),
        permissions: "r--",
      },
      diagnostics: {
        name: "diagnostics",
        permissions: "rwx",
        children: {
          "module-report.txt": {
            name: "module-report.txt",
            content:
              "Module LS-07 Report:\nType: Oxygen Recycler\nLocation: Sector 7, Bay 3\nStatus: FAILED\nLast maintenance: 2187-02-28\nRepair difficulty: MODERATE",
            permissions: "r--",
          },
        },
      },
    },
  },
  checkCompletion: (state) => {
    // Player must have used grep on the log and tail on repair codes
    const usedGrep = state.commandsUsed.includes("grep");
    const usedTail = state.commandsUsed.includes("tail");
    const usedCat = state.commandsUsed.includes("cat");
    return usedGrep && usedTail && usedCat;
  },
};
