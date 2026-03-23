import { StageDefinition } from "@/types";

export const stage4: StageDefinition = {
  id: "stage-4",
  name: "Rogue Process",
  subtitle: "Mini-boss — Terminate the hostile process",
  description:
    "A rogue AI process has taken control of the defense drones. Find and kill the correct process to disable them.",
  commands: ["ps", "kill", "ls", "cat"],
  objectives: [
    {
      id: "inspect-processes",
      description: "Use 'ps' to view running processes",
      completed: false,
    },
    {
      id: "identify-threat",
      description: "Read intel files to identify the hostile process",
      completed: false,
    },
    {
      id: "kill-boss",
      description: "Use 'kill' with the correct PID to terminate the rogue process",
      completed: false,
    },
  ],
  hints: [
    "Type 'ps' to see all running processes and their PIDs.",
    "Use 'ls' and 'cat' to read intel files about the rogue process.",
    "Read intel/threat-analysis.txt to find out which process is the boss.",
    "The rogue process is 'DRONE-MASTER'. Find its PID with 'ps', then use 'kill <PID>'.",
  ],
  missionBriefing:
    "ALERT: Defense drones have been hijacked by a rogue process! Inspect the process table, gather intel, and terminate the correct process. Be careful — killing the wrong one has consequences!",
  initialProcesses: [
    {
      pid: 1,
      name: "fortress-core",
      status: "running",
      description: "Main fortress operating system",
      hostile: false,
    },
    {
      pid: 42,
      name: "life-support",
      status: "running",
      description: "Life support controller",
      hostile: false,
    },
    {
      pid: 137,
      name: "shield-daemon",
      status: "running",
      description: "Shield management process",
      hostile: false,
    },
    {
      pid: 256,
      name: "DRONE-MASTER",
      status: "running",
      description: "Unknown process — controlling defense drones",
      hostile: true,
      isBoss: true,
    },
    {
      pid: 257,
      name: "drone-relay-1",
      status: "running",
      description: "Drone communication relay",
      hostile: true,
    },
    {
      pid: 258,
      name: "drone-relay-2",
      status: "running",
      description: "Drone communication relay",
      hostile: true,
    },
    {
      pid: 300,
      name: "nav-computer",
      status: "running",
      description: "Navigation computer",
      hostile: false,
    },
    {
      pid: 512,
      name: "comms-array",
      status: "stopped",
      description: "Communications array (offline)",
      hostile: false,
    },
  ],
  initialFileSystem: {
    name: "/",
    permissions: "rwx",
    children: {
      intel: {
        name: "intel",
        permissions: "rwx",
        children: {
          "threat-analysis.txt": {
            name: "threat-analysis.txt",
            content: [
              "=== THREAT ANALYSIS REPORT ===",
              "",
              "At 0800 hours, defense drones began erratic behavior.",
              "Root cause: unauthorized process 'DRONE-MASTER' (PID 256)",
              "This process is issuing commands to drone relays.",
              "",
              "RECOMMENDATION: Terminate DRONE-MASTER to disable all drones.",
              "WARNING: Do NOT kill fortress-core or life-support!",
              "",
              "Relay processes will shut down automatically once",
              "the master process is terminated.",
            ].join("\n"),
            permissions: "r--",
          },
          "drone-log.txt": {
            name: "drone-log.txt",
            content: [
              "[08:00] Drone patrol initialized",
              "[08:05] DRONE-MASTER override detected",
              "[08:06] Drones rerouted to hostile patrol pattern",
              "[08:10] Warning: weapons armed on all drones",
              "[08:15] Manual override attempted — DENIED",
              "[08:20] DRONE-MASTER rejecting all standard kill signals",
            ].join("\n"),
            permissions: "r--",
          },
        },
      },
      "process-manual.txt": {
        name: "process-manual.txt",
        content: [
          "FORTRESS PROCESS MANAGEMENT MANUAL",
          "",
          "Commands:",
          "  ps       - List all running processes",
          "  kill PID - Terminate a process by its PID number",
          "",
          "Tips:",
          "  - Always verify the PID before killing a process",
          "  - System-critical processes should not be terminated",
          "  - Check intel reports before taking action",
        ].join("\n"),
        permissions: "r--",
      },
    },
  },
  checkCompletion: (state) => {
    // Boss process (PID 256, DRONE-MASTER) must be killed
    return !state.processes.some((p) => p.pid === 256);
  },
};
