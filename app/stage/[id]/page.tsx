"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game/state/game-store";
import Terminal from "@/components/terminal/Terminal";
import GameWorld from "@/components/game/GameWorld";
import MissionPanel from "@/components/game/MissionPanel";
import StageComplete from "@/components/game/StageComplete";
import { getStageDefinition } from "@/lib/game/stages";

export default function StagePage() {
  const params = useParams();
  const router = useRouter();
  const stageId = params.id as string;

  const loadStage = useGameStore((s) => s.loadStage);
  const stageState = useGameStore((s) => s.stageState);
  const loadProgress = useGameStore((s) => s.loadProgress);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    const definition = getStageDefinition(stageId);
    if (!definition) {
      router.push("/");
      return;
    }
    loadStage(stageId);
  }, [stageId, loadStage, router]);

  if (!stageState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          Loading fortress systems...
        </div>
      </div>
    );
  }

  const definition = getStageDefinition(stageId);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800">
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          ← Exit
        </button>
        <div className="text-center">
          <div className="text-cyan-400 text-sm font-bold">
            {definition?.name}
          </div>
          <div className="text-gray-600 text-[10px]">
            {definition?.subtitle}
          </div>
        </div>
        <div className="text-gray-600 text-xs">
          {stageState.commandsUsed.length} cmds
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Game world + Mission */}
        <div className="w-80 lg:w-96 flex flex-col border-r border-gray-800 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3">
            <GameWorld />
          </div>
          <div className="h-64 border-t border-gray-800 overflow-y-auto p-3">
            <MissionPanel />
          </div>
        </div>

        {/* Right: Terminal */}
        <div className="flex-1 p-3 overflow-hidden">
          <Terminal />
        </div>
      </div>

      {/* Stage complete overlay */}
      <StageComplete />
    </div>
  );
}
