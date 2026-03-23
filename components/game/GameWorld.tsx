"use client";

import { useGameStore } from "@/lib/game/state/game-store";
import { useI18n } from "@/lib/i18n/provider";
import { isDirectory, VFSDirectory } from "@/types";
import { getNodeAtPath } from "@/lib/shell/commands/filesystem-utils";

export default function GameWorld() {
  const stageState = useGameStore((s) => s.stageState);
  const { t } = useI18n();

  if (!stageState) return null;

  const currentNode = getNodeAtPath(stageState.fileSystem, stageState.currentPath);
  const currentDir =
    currentNode && isDirectory(currentNode) ? currentNode : null;

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-gray-900/80 border border-cyan-900/40 rounded-lg p-4">
        <div className="text-cyan-400 text-xs font-mono mb-1">{t.location}</div>
        <div className="text-white font-mono text-lg">{stageState.currentPath}</div>
      </div>

      <div className="flex-1 bg-gray-900/80 border border-cyan-900/40 rounded-lg p-4 overflow-auto">
        <div className="text-cyan-400 text-xs font-mono mb-3">{t.sectorMap}</div>
        {currentDir && (
          <DirectoryView
            dir={currentDir}
            path={stageState.currentPath}
            doors={stageState.doors}
          />
        )}
      </div>

      {stageState.processes.length > 0 && (
        <div className="bg-gray-900/80 border border-red-900/40 rounded-lg p-4">
          <div className="text-red-400 text-xs font-mono mb-2">{t.activeProcesses}</div>
          <div className="grid gap-1">
            {stageState.processes.map((proc) => (
              <div
                key={proc.pid}
                className={`flex items-center gap-3 text-xs font-mono px-2 py-1 rounded ${
                  proc.hostile
                    ? "bg-red-950/50 text-red-300"
                    : "bg-gray-800/50 text-gray-400"
                }`}
              >
                <span className="text-gray-500 w-12">PID {proc.pid}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    proc.status === "running"
                      ? proc.hostile
                        ? "bg-red-500 animate-pulse"
                        : "bg-green-500"
                      : "bg-gray-600"
                  }`}
                />
                <span className="flex-1">{proc.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DirectoryView({
  dir,
  path,
  doors,
}: {
  dir: VFSDirectory;
  path: string;
  doors: Record<string, boolean>;
}) {
  const { t } = useI18n();
  const entries = Object.values(dir.children);

  if (entries.length === 0) {
    return <div className="text-gray-600 text-sm font-mono italic">{t.emptyRoom}</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {path !== "/" && (
        <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
          <span className="text-2xl">⬆</span>
          <div>
            <div className="text-yellow-400 text-xs font-mono">..</div>
            <div className="text-gray-500 text-[10px]">{t.parent}</div>
          </div>
        </div>
      )}

      {entries.map((entry) => {
        const isDir = isDirectory(entry);
        const doorKey = `door-${path === "/" ? "" : path}/${entry.name}`;
        const visited = doors[doorKey];

        return (
          <div
            key={entry.name}
            className={`flex items-center gap-2 rounded-lg p-3 border transition-colors ${
              isDir
                ? visited
                  ? "bg-cyan-950/30 border-cyan-800/50"
                  : "bg-gray-800/60 border-gray-700/50 hover:border-cyan-700/50"
                : "bg-gray-800/40 border-gray-700/30"
            }`}
          >
            <span className="text-2xl">
              {isDir ? (visited ? "🚪" : "🔒") : "📄"}
            </span>
            <div className="min-w-0">
              <div
                className={`text-xs font-mono truncate ${
                  isDir ? "text-cyan-300" : "text-gray-400"
                }`}
              >
                {entry.name}
              </div>
              <div className="text-[10px] text-gray-600">
                {isDir ? t.directory : t.file}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
