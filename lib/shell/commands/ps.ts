import { CommandHandler } from ".";

export const ps: CommandHandler = (_args, state) => {
  if (state.processes.length === 0) {
    return { output: "No active processes." };
  }

  const header = "  PID  STATUS     NAME";
  const lines = state.processes.map((p) => {
    const pid = String(p.pid).padStart(5);
    const status = p.status.padEnd(10);
    return `${pid}  ${status} ${p.name}`;
  });

  return { output: [header, ...lines].join("\n") };
};
