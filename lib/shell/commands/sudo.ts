import { CommandHandler } from ".";

export const sudo: CommandHandler = (args, state) => {
  if (args.length === 0) {
    return { output: "", error: "sudo: missing command" };
  }

  if (state.sudoEnabled) {
    return { output: "sudo: already elevated." };
  }

  return {
    output: "[SUDO] Elevated privileges granted for this session.",
    sideEffects: [{ type: "sudo", enabled: true }],
  };
};
