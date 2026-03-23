"use client";

import { useGameStore } from "@/lib/game/state/game-store";

export default function MissionPanel() {
  const stageState = useGameStore((s) => s.stageState);
  const useHint = useGameStore((s) => s.useHint);
  const resetStage = useGameStore((s) => s.resetStage);

  if (!stageState) return null;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Objectives */}
      <div className="bg-gray-900/80 border border-amber-900/40 rounded-lg p-4">
        <div className="text-amber-400 text-xs font-mono mb-2">OBJECTIVES</div>
        <div className="space-y-2">
          {stageState.objectives.map((obj) => (
            <div key={obj.id} className="flex items-start gap-2">
              <span className="text-sm mt-0.5">
                {obj.completed ? "✅" : "⬜"}
              </span>
              <span
                className={`text-xs ${
                  obj.completed ? "text-green-400 line-through" : "text-gray-300"
                }`}
              >
                {obj.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Learned Commands */}
      <div className="bg-gray-900/80 border border-purple-900/40 rounded-lg p-4">
        <div className="text-purple-400 text-xs font-mono mb-2">COMMANDS USED</div>
        <div className="flex flex-wrap gap-1">
          {[...new Set(stageState.commandsUsed)].map((cmd) => (
            <span
              key={cmd}
              className="px-2 py-0.5 bg-purple-950/50 text-purple-300 text-xs font-mono rounded"
            >
              {cmd}
            </span>
          ))}
          {stageState.commandsUsed.length === 0 && (
            <span className="text-gray-600 text-xs italic">
              No commands used yet
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => useHint()}
          className="flex-1 px-3 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 text-xs font-mono rounded border border-amber-800/40 transition-colors"
        >
          💡 Hint ({stageState.hintsUsed})
        </button>
        <button
          onClick={resetStage}
          className="flex-1 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-mono rounded border border-red-800/40 transition-colors"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
