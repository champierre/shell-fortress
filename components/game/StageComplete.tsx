"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game/state/game-store";
import { StageResult } from "@/types";
import { useState, useEffect } from "react";

export default function StageComplete() {
  const router = useRouter();
  const stageState = useGameStore((s) => s.stageState);
  const completeStage = useGameStore((s) => s.completeStage);
  const [result, setResult] = useState<StageResult | null>(null);

  useEffect(() => {
    if (stageState?.completed && !result) {
      const r = completeStage();
      if (r) setResult(r);
    }
  }, [stageState?.completed, completeStage, result]);

  if (!stageState?.completed || !result) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-green-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-green-500/10">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-green-400 font-mono">
            STAGE CLEAR
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Mission accomplished, operator.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <StatRow label="Time" value={formatTime(result.timeSeconds)} />
          <StatRow label="Commands Used" value={String(result.commandsUsed)} />
          <StatRow label="Hints Used" value={String(result.hintsUsed)} />
          {result.newCommandsLearned.length > 0 && (
            <div>
              <div className="text-gray-500 text-xs font-mono mb-1">
                NEW COMMANDS LEARNED
              </div>
              <div className="flex flex-wrap gap-1">
                {result.newCommandsLearned.map((cmd) => (
                  <span
                    key={cmd}
                    className="px-2 py-0.5 bg-green-950/50 text-green-300 text-xs font-mono rounded"
                  >
                    {cmd}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-sm rounded-lg transition-colors"
          >
            Stage Select
          </button>
          <button
            onClick={() => {
              const nextId = getNextStageId(result.stageId);
              if (nextId) {
                router.push(`/stage/${nextId}`);
              } else {
                router.push("/");
              }
            }}
            className="flex-1 py-3 bg-green-800 hover:bg-green-700 text-green-100 font-mono text-sm rounded-lg transition-colors"
          >
            {getNextStageId(result.stageId) ? "Next Stage →" : "Back to Menu"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-800">
      <span className="text-gray-500 text-xs font-mono">{label}</span>
      <span className="text-white font-mono text-sm">{value}</span>
    </div>
  );
}

function getNextStageId(current: string): string | null {
  const ids = ["stage-1", "stage-2", "stage-3", "stage-4"];
  const idx = ids.indexOf(current);
  return idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : null;
}
