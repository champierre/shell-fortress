"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game/state/game-store";
import { useI18n } from "@/lib/i18n/provider";
import { getAllStages } from "@/lib/game/stages";
import { GameProgress } from "@/types";

type Screen = "title" | "stages";

export default function Home() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("title");
  const progress = useGameStore((s) => s.progress);
  const loadProgress = useGameStore((s) => s.loadProgress);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  if (screen === "title") {
    return <TitleScreen onStart={() => setScreen("stages")} />;
  }

  return (
    <StageSelect
      progress={progress}
      onSelect={(id) => router.push(`/stage/${id}`)}
      onBack={() => setScreen("title")}
    />
  );
}

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ja" : "en")}
      className="px-3 py-1 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 text-gray-400 hover:text-gray-200 text-xs font-mono rounded transition-colors"
    >
      {locale === "en" ? "日本語" : "English"}
    </button>
  );
}

function TitleScreen({ onStart }: { onStart: () => void }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 text-center">
        <div className="text-green-500/30 text-xs font-mono mb-4 tracking-[0.3em]">
          {t.bootMessage}
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold mb-2 tracking-tight">
          <span className="text-green-400">SHELL</span>
          <br />
          <span className="text-cyan-400">FORTRESS</span>
        </h1>

        <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
          {t.subtitle}
        </p>

        {showPrompt && (
          <button
            onClick={onStart}
            className="mt-12 px-8 py-4 bg-green-900/30 hover:bg-green-900/50 border border-green-500/50 hover:border-green-400 text-green-400 font-mono text-lg rounded-lg transition-all duration-300 animate-glow hover:animate-none"
          >
            {t.startMission}
          </button>
        )}

        <div className="mt-8 text-gray-700 text-xs">
          <span className="text-green-800">$</span> {t.browserGame}
        </div>
      </div>
    </div>
  );
}

function StageSelect({
  progress,
  onSelect,
  onBack,
}: {
  progress: GameProgress;
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  const stages = getAllStages();
  const { t, stageT } = useI18n();

  return (
    <div className="min-h-screen flex flex-col p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          {t.back}
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-xl text-cyan-400 font-mono">{t.stageSelect}</h2>
          <LanguageSwitcher />
        </div>
        <div className="text-gray-600 text-xs">
          {progress.stagesCompleted.length}/{stages.length} {t.cleared}
        </div>
      </div>

      <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto w-full">
        {stages.map((stage, idx) => {
          const isUnlocked = progress.stagesUnlocked.includes(stage.id);
          const isCompleted = progress.stagesCompleted.includes(stage.id);
          const trans = stageT(stage.id);

          return (
            <button
              key={stage.id}
              onClick={() => isUnlocked && onSelect(stage.id)}
              disabled={!isUnlocked}
              className={`text-left p-6 rounded-xl border transition-all duration-200 ${
                isCompleted
                  ? "bg-green-950/30 border-green-800/50 hover:border-green-600/50"
                  : isUnlocked
                    ? "bg-gray-900/60 border-cyan-900/50 hover:border-cyan-600/50 hover:bg-gray-900/80"
                    : "bg-gray-900/30 border-gray-800/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">
                  {isCompleted ? "✅" : isUnlocked ? "🔓" : "🔒"}
                </span>
                <div>
                  <div className="text-gray-500 text-xs">{t.stage} {idx + 1}</div>
                  <div
                    className={`font-bold ${
                      isCompleted
                        ? "text-green-400"
                        : isUnlocked
                          ? "text-white"
                          : "text-gray-600"
                    }`}
                  >
                    {trans?.name || stage.name}
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {trans?.subtitle || stage.subtitle}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {stage.commands.map((cmd) => (
                  <span
                    key={cmd}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                      progress.learnedCommands.includes(cmd)
                        ? "bg-green-950/50 text-green-400"
                        : "bg-gray-800/50 text-gray-600"
                    }`}
                  >
                    {cmd}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="text-gray-600 text-xs">
          {t.commandsLearned}: {progress.learnedCommands.length} | {t.totalCommandsUsed}: {progress.totalCommandsUsed}
        </div>
      </div>
    </div>
  );
}
