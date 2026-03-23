import { CommandHandler } from ".";

export const pwd: CommandHandler = (_args, state) => {
  return { output: state.currentPath };
};
