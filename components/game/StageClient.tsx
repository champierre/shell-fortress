"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game/state/game-store";
import { useI18n } from "@/lib/i18n/provider";
import Terminal from "@/components/terminal/Terminal";
import GameWorld from "@/components/game/GameWorld";
import MissionPanel from "@/components/game/MissionPanel";
import StageComplete from "@/components/game/StageComplete";
import { getStageDefinition } from "@/lib/game/stages";

export default function StageClient({ stageId }: { stageId: string }) {
  const router = useRouter();
  const { t, locale, stageT } = useI18n();

  const loadStage = useGameStore((s) => s.loadStage);
  const setLocale = useGameStore((s) => s.setLocale);
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
    setLocale(locale);
    loadStage(stageId, locale);
  }, [stageId, loadStage, setLocale, locale, router]);

  if (!stageState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">
          {t.loading}
        </div>
      </div>
    );
  }

  const stageTrans = stageT(stageId);
  const stageName = stageTrans?.name || getStageDefinition(stageId)?.name;
  const stageSubtitle = stageTrans?.subtitle || getStageDefinition(stageId)?.subtitle;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800">
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          {t.exit}
        </button>
        <div className="text-center">
          <div className="text-cyan-400 text-sm font-bold">
            {stageName}
          </div>
          <div className="text-gray-600 text-[10px]">
            {stageSubtitle}
          </div>
        </div>
        <div className="text-gray-600 text-xs">
          {stageState.commandsUsed.length} {t.cmds}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 lg:w-96 flex flex-col border-r border-gray-800 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3">
            <GameWorld />
          </div>
          <div className="h-64 border-t border-gray-800 overflow-y-auto p-3">
            <MissionPanel />
          </div>
        </div>

        <div className="flex-1 p-3 overflow-hidden">
          <Terminal />
        </div>
      </div>

      <StageComplete />
    </div>
  );
}
