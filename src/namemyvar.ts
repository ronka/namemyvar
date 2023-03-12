#!/usr/bin/env node

import chalk from "chalk";
import { OptionValues, program } from "commander";
import openai from "./openai";

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

  const prompt = generatePrompt(options);

  console.log("Generating name ...\n");

  try {
    const name = await generateName(prompt);

    console.log(chalk.green("▪ ") + name);
  } catch (e) {
    console.log(chalk.red("▪ ") + e.message);
  }
}

async function generateName(prompt: string) {
  const payload = {
    model: "text-davinci-003",
    prompt,
  };

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: false,
    n: 1,
  });

  if (completion.status !== 200) {
    const error = await completion.statusText;

    throw new Error(
      `OpenAI API failed while processing the request '${error}'`
    );
  }

  const { choices } = completion.data;

  const aiName = choices[0].message.content;

  if (!isValidName(aiName)) {
    throw new Error(`Invalid name generated, ${aiName} try again`);
  }

  return functionCleanName(aiName);
}

function generatePrompt(options: OptionValues) {
  const input = program.args.join(" ");
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

function functionCleanName(str: string) {
  return (
    str
      // trim
      .replace(/(\r\n|\n|\r)/gm, "")
      // clean parenthesis
      .replace(/\(|\)/gm, "")
  );
}
