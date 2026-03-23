import { ParsedCommand, PipelineCommand } from "@/types";

export function parsePipeline(input: string): PipelineCommand {
  const raw = input.trim();
  const segments = raw.split("|").map((s) => s.trim()).filter(Boolean);

  const commands: ParsedCommand[] = segments.map((segment) => {
    const tokens = tokenize(segment);
    return {
      name: tokens[0] || "",
      args: tokens.slice(1),
      raw: segment,
    };
  });

  return { commands };
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuote: string | null = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuote) {
      if (ch === inQuote) {
        inQuote = null;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === " " || ch === "\t") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}
