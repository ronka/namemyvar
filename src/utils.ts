import type { OptionValues } from "commander";

function generatePrompt(input: string, options: OptionValues) {
  const context = options.context ? `written in ${options.context}` : "";
  const type = options.type ?? "peace of code";

  return `You're a software architect who reads Clean Code and knows how to name variables appropriately.
    Do not add anything to the suggested name. Print only the suggested name, print one word, no special characters, no parentheses.
    Give name to a ${type} ${context} that does this: ${input}`;
}

function isValidAPIKey(key: string) {
  return key && key.startsWith("sk-");
}

function isValidName(str: string) {
  return str.split(" ").length === 1;
}

function cleanName(str: string) {
  return (
    str
      // trim
      .replace(/(\r\n|\n|\r)/gm, "")
      // clean parenthesis
      .replace(/\(|\)/gm, "")
  );
}

export { generatePrompt, isValidAPIKey, isValidName, cleanName };
