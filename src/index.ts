#! /usr/bin/env node
import { main } from "./namemyvar";
import { program } from "commander";

program
  .version("0.0.1")
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

(async () => {
  await main();
})();
