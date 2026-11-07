#!/usr/bin/env node

import { parseCLI } from "./parsing.js";
import { findMatchingLines, matchingLinesDiff, matchLinesAfterAndBefore } from "./search.js";

const args = parseCLI();
console.log("arguments are: ", args);
runCLI(args);

async function runCLI(args) {
  if (args.length === 3) {
    const argument1 = args[0];
    const argument2 = args[1];
    const argument3 = args[2];
    await matchingLinesDiff(argument1, argument2, argument3);
  } else if (args.length === 2) {
    const argument1 = args[0];
    const argument2 = args[1];
    await findMatchingLines(argument1, argument2);
  } else if (args.length === 4) {
    const argument1 = args[0];
    const argument2 = args[1];
    const argument3 = args[2];
    const argument4 = args[3];
    await matchLinesAfterAndBefore(argument1, argument2, argument3, argument4);
  }
}
