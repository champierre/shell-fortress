"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useGameStore } from "@/lib/game/state/game-store";
import { useI18n } from "@/lib/i18n/provider";
import { tabComplete } from "@/lib/shell/completer";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const stageState = useGameStore((s) => s.stageState);
  const executeCommand = useGameStore((s) => s.executeCommand);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [stageState?.terminalHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setInputHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    executeCommand(input);
    setInput("");
  };

  const handleTab = () => {
    if (!stageState || !input) return;
    const result = tabComplete(input, stageState);
    setInput(result.completed);
    if (result.candidates.length > 1) {
      // Show candidates in terminal output
      useGameStore.setState({
        stageState: {
          ...stageState,
          terminalHistory: [
            ...stageState.terminalHistory,
            { type: "output" as const, text: result.candidates.join("  ") },
          ],
        },
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTab();
    } else if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? inputHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(inputHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= inputHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(inputHistory[newIndex]);
        }
      }
    }
  };

  if (!stageState) return null;

  return (
    <div
      className="flex flex-col h-full bg-gray-950 border border-green-900/50 rounded-lg overflow-hidden font-mono"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border-b border-green-900/30">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-green-500/70 text-xs">
          {t.terminalPath} — {stageState.currentPath}
        </span>
      </div>

      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 text-sm"
      >
        {stageState.terminalHistory.map((line, i) => (
          <div key={i} className={getLineClass(line.type)}>
            <pre className="whitespace-pre-wrap break-words">{line.text}</pre>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-t border-green-900/30">
        <span className="text-green-400 text-sm shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-300 text-sm outline-none placeholder-green-800 caret-green-400"
          placeholder={
            stageState.completed ? t.stageCompleteInput : t.typeCommand
          }
          disabled={stageState.completed}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function getLineClass(type: string): string {
  switch (type) {
    case "input":
      return "text-green-400";
    case "output":
      return "text-gray-300";
    case "error":
      return "text-red-400";
    case "system":
      return "text-cyan-400";
    default:
      return "text-gray-400";
  }
}
