import { StageDefinition } from "@/types";

export const stage1: StageDefinition = {
  id: "stage-1",
  name: "Navigation Sector",
  subtitle: "Learn to navigate the fortress",
  description:
    "The fortress entrance. Each room is a directory. Use terminal commands to find your way to the exit.",
  commands: ["pwd", "ls", "cd"],
  objectives: [
    {
      id: "find-map",
      description: "Use 'ls' to discover the rooms in the fortress",
      completed: false,
    },
    {
      id: "navigate-corridor",
      description: "Navigate to the east-corridor using 'cd'",
      completed: false,
    },
    {
      id: "reach-exit",
      description: "Find and reach the exit room",
      completed: false,
    },
  ],
  hints: [
    "Try typing 'ls' to see what's in the current directory.",
    "Use 'cd <dirname>' to enter a room. Try 'cd east-corridor'.",
    "The exit is inside the east-corridor. Use 'ls' there, then 'cd' to the exit.",
    "Full path: cd east-corridor, then cd control-room, then cd exit",
  ],
  missionBriefing:
    "You've breached the fortress outer hull. Navigate through the directory structure to reach the exit. Use pwd, ls, and cd to explore.",
  initialFileSystem: {
    name: "/",
    permissions: "rwx",
    children: {
      "west-corridor": {
        name: "west-corridor",
        permissions: "rwx",
        children: {
          "storage-room": {
            name: "storage-room",
            permissions: "rwx",
            children: {
              "supplies.txt": {
                name: "supplies.txt",
                content: "Emergency rations: 12\nOxygen tanks: 4\nRepair kits: 2",
                permissions: "r--",
              },
            },
          },
          "dead-end": {
            name: "dead-end",
            permissions: "rwx",
            children: {
              "warning.txt": {
                name: "warning.txt",
                content: "⚠ This corridor has been sealed. Turn back.",
                permissions: "r--",
              },
            },
          },
        },
      },
      "east-corridor": {
        name: "east-corridor",
        permissions: "rwx",
        children: {
          "control-room": {
            name: "control-room",
            permissions: "rwx",
            children: {
              exit: {
                name: "exit",
                permissions: "rwx",
                children: {
                  "access-granted.txt": {
                    name: "access-granted.txt",
                    content: "EXIT UNLOCKED. You have navigated the sector successfully.",
                    permissions: "r--",
                  },
                },
              },
              "terminal-log.txt": {
                name: "terminal-log.txt",
                content: "Last access: 2187-03-14\nStatus: EXIT door is through this room.",
                permissions: "r--",
              },
            },
          },
          "observation-deck": {
            name: "observation-deck",
            permissions: "rwx",
            children: {
              "view.txt": {
                name: "view.txt",
                content:
                  "Through the viewport you see the vastness of space. The fortress orbits a dying star.",
                permissions: "r--",
              },
            },
          },
        },
      },
      "readme.txt": {
        name: "readme.txt",
        content:
          "FORTRESS NAVIGATION SYSTEM v2.1\nUse 'ls' to list rooms.\nUse 'cd <room>' to enter a room.\nUse 'pwd' to see your current location.\nFind the exit to proceed.",
        permissions: "r--",
      },
    },
  },
  checkCompletion: (state) => {
    return state.currentPath === "/east-corridor/control-room/exit";
  },
};
