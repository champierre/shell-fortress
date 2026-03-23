import { CommandHandler } from ".";

export const kill: CommandHandler = (args, state) => {
  if (args.length === 0) {
    return { output: "", error: "kill: missing PID" };
  }

  const pid = parseInt(args[0], 10);
  if (isNaN(pid)) {
    return { output: "", error: `kill: invalid PID: ${args[0]}` };
  }

  const process = state.processes.find((p) => p.pid === pid);
  if (!process) {
    return { output: "", error: `kill: (${pid}) - No such process` };
  }

  if (process.hostile && process.isBoss) {
    return {
      output: `Terminating hostile process [${process.name}] (PID ${pid})...`,
      sideEffects: [
        { type: "killProcess", pid },
        { type: "stageComplete" },
      ],
    };
  }

  if (process.hostile) {
    return {
      output: `Process [${process.name}] (PID ${pid}) terminated.`,
      sideEffects: [{ type: "killProcess", pid }],
    };
  }

  return {
    output: "",
    error: `WARNING: Killing friendly process [${process.name}] caused a system disruption!`,
    sideEffects: [
      { type: "penalty", message: `Wrong target! ${process.name} was a friendly process.` },
    ],
  };
};
