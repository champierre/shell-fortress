import { StageDefinition } from "@/types";

export const stage3: StageDefinition = {
  id: "stage-3",
  name: "Data Conveyor",
  subtitle: "Master pipelines and text processing",
  description:
    "Data packets flow through a corrupted conveyor. Build pipelines to filter and sort the data to match the target output.",
  commands: ["cat", "grep", "sort", "uniq", "head", "tail", "wc"],
  objectives: [
    {
      id: "filter-data",
      description: "Use a pipeline with grep to filter the cargo data",
      completed: false,
    },
    {
      id: "sort-unique",
      description: "Build a pipeline with sort and uniq to deduplicate results",
      completed: false,
    },
    {
      id: "match-target",
      description: "Produce output that exactly matches the target manifest",
      completed: false,
    },
  ],
  hints: [
    "Start with 'cat cargo-data.txt' to see the raw data.",
    "Check 'cat target-manifest.txt' to see what the final output should be.",
    "Use 'cat cargo-data.txt | grep PRIORITY' to filter priority items.",
    "Full solution: cat cargo-data.txt | grep PRIORITY | sort | uniq",
  ],
  missionBriefing:
    "The data conveyor is jammed with corrupted cargo manifests. Build a pipeline to filter, sort, and deduplicate the data. Your output must match the target manifest exactly.",
  initialFileSystem: {
    name: "/",
    permissions: "rwx",
    children: {
      "cargo-data.txt": {
        name: "cargo-data.txt",
        content: [
          "PRIORITY: fuel-cells",
          "JUNK: broken-sensor",
          "PRIORITY: oxygen-tanks",
          "JUNK: corrupted-data",
          "PRIORITY: fuel-cells",
          "PRIORITY: med-kits",
          "JUNK: space-debris",
          "PRIORITY: oxygen-tanks",
          "PRIORITY: shield-parts",
          "JUNK: old-rations",
          "PRIORITY: fuel-cells",
          "PRIORITY: med-kits",
          "PRIORITY: nav-chips",
          "JUNK: broken-antenna",
          "PRIORITY: shield-parts",
        ].join("\n"),
        permissions: "r--",
      },
      "target-manifest.txt": {
        name: "target-manifest.txt",
        content: [
          "PRIORITY: fuel-cells",
          "PRIORITY: med-kits",
          "PRIORITY: nav-chips",
          "PRIORITY: oxygen-tanks",
          "PRIORITY: shield-parts",
        ].join("\n"),
        permissions: "r--",
      },
      "instructions.txt": {
        name: "instructions.txt",
        content:
          "CONVEYOR SYSTEM MANUAL\n\nTo repair the conveyor, produce a clean manifest.\n1. Read the cargo data (cat)\n2. Filter for PRIORITY items only (grep)\n3. Sort the results (sort)\n4. Remove duplicates (uniq)\n5. Compare with target-manifest.txt\n\nPipelines connect commands with the | symbol.\nExample: cat file.txt | grep pattern | sort",
        permissions: "r--",
      },
    },
  },
  checkCompletion: (state) => {
    // Check if the player has produced output matching the target
    const history = state.terminalHistory;
    const targetOutput = [
      "PRIORITY: fuel-cells",
      "PRIORITY: med-kits",
      "PRIORITY: nav-chips",
      "PRIORITY: oxygen-tanks",
      "PRIORITY: shield-parts",
    ].join("\n");

    return history.some(
      (line) => line.type === "output" && line.text.trim() === targetOutput.trim()
    );
  },
};
