#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import fetch from "node-fetch";

program
  .version("1.0.0")
  .description(
    "Let AI name your variables, give a description and it will do the rest"
  )
  .option(
    "-c, --context <context>",
    "in which context the name is going to be used"
  )
  .option(
    "-t, --type <type>",
    "the type of the variable(boolean, function, number etc)"
  )
  .parse(process.argv);

const OPENAI_KEY = process.env.OPENAI_KEY;

export async function main() {
  if (!isValidAPIKey(OPENAI_KEY)) {
    console.log(chalk.red("▪ ") + "OPENAI_KEY is not set");
    return;
  }

  const options = program.opts();

  const input = program.args.join(" ");
  const context = options.context ? `written in ${options.context}` : "";
  const type = options.type ?? "peace of code";

  const prompt = `You're a software architect who reads Clean Code and knows how to name variables appropriately.
  Do not add anything to the suggested name. Print only the suggested name, print one word, no special characters, no parentheses.
  Give name to a ${type} ${context} that does this: ${input}`;

  console.log("Generating name ...\n");

  try {
    const name = await generateName(prompt);

    console.log(chalk.green("▪ ") + name);
  } catch (e) {
    console.log(chalk.red("▪ ") + "error occured, please try again");
  }
}

async function generateName(prompt: string) {
  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: false,
    n: 1,
  };

  const response = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.status !== 200) {
    const error = await response.json();

    throw new Error(
      `OpenAI API failed while processing the request '${error?.error?.message}'`
    );
  }

  const { choices } = await response.json();

  const aiName = choices[0].text;

  if (!isValidName(aiName)) {
    throw new Error("Invalid name generated");
  }

  return functionCleanName(aiName);
}

function isValidAPIKey(key: string) {
  return key && key.startsWith("sk-");
}

function isValidName(str: string) {
  return str.split(" ").length === 1;
}

function functionCleanName(str: string) {
  return (
    str
      // trim
      .replace(/(\r\n|\n|\r)/gm, "")
      // clean parenthesis
      .replace(/\(|\)/gm, "")
  );
}
