import { checkFile, isFileEmpty } from "./utils/helper.js";
import path from "path";
import {
  countMatchPattern,
  getMatchPattenInsideDir,
  getMatchPatternWithLineNumber,
  getNotMatchedPattern,
  listFilenameMatches,
  matchLinesPlusSpecificLinesAfter,
  matchLinesPlusSpecificLinesBefore,
  matchPatternIgnoreUpperAndLowerCase,
  matchWholeWord,
} from "./utils/cliMethod.js";
import { readFile } from "fs/promises";

async function findMatchingLines(pattern, file) {
  const currectPath = path.resolve(file);

  let matchPattern = [];
  const isFileExits = await checkFile(currectPath);

  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);

  if (fileEmpty) {
    console.log("📂 File is empty.");
    return fileEmpty;
  }
  const fileData = await readFile(file, "utf-8");
  const lines = fileData.toString().split("\n");

  for (let line of lines) {
    if (line.includes(pattern)) {
      matchPattern.push(line);
    }
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  console.log("match pattern is: ", matchPattern);

  for (const line of matchPattern) {
    console.log(line);
  }
}

async function matchingLinesDiff(option, pattern, file, specificLines) {
  let matchPattern = [];
  let count = 1;

  const currectPath = path.resolve(file);
  console.log("current folder is: ", currectPath);

  if (option === "-i") {
    await matchPatternIgnoreUpperAndLowerCase(
      pattern,
      currectPath,
      matchPattern,
    );
  } else if (option === "-n") {
    await getMatchPatternWithLineNumber(
      pattern,
      currectPath,
      matchPattern,
      count,
    );
  } else if (option === "-v") {
    await getNotMatchedPattern(pattern, currectPath, matchPattern);
  } else if (option === "-r") {
    await getMatchPattenInsideDir(pattern, matchPattern, currectPath);
  } else if (option === "-c") {
    console.log("condition true hai...");
    await countMatchPattern(pattern, file);
  } else if (option === "-l") {
    await listFilenameMatches(pattern, currectPath, file);
  } else if (option === "-w") {
    await matchWholeWord(pattern, currectPath, matchPattern);
  }
}

async function matchLinesAfterAndBefore(option, specificLines, pattern, file) {
  let matchPattern = [];

  const currectPath = path.resolve(file);
  console.log("current folder is: ", currectPath);
  if (option === "-A") {
    await matchLinesPlusSpecificLinesAfter(
      specificLines,
      pattern,
      currectPath,
      matchPattern,
    )
  } else if (option === "-B"){
    await matchLinesPlusSpecificLinesBefore(
      specificLines,
      pattern,
      currectPath,
      matchPattern,
    )
  }
}

export { findMatchingLines, matchingLinesDiff, matchLinesAfterAndBefore };
