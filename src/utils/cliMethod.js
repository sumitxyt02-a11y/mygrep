import { match } from "assert";
import { getAllFiles } from "../file-discovery.js";
import { checkFile, isFileEmpty } from "./helper.js";
import { readFile } from "fs/promises";

async function matchPatternIgnoreUpperAndLowerCase(
  pattern,
  currectPath,
  matchPattern,
) {
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    // return fileEmpty;
    return;
  }

  const fileData = await readFile(currectPath);
  const lines = fileData.toString().split(/\r?\n/);
  for (let line of lines) {
    if (line.toLocaleLowerCase().includes(pattern.toLocaleLowerCase())) {
      matchPattern.push(line);
    }
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  console.log("matching patterns are: ", matchPattern);

  for (const line of matchPattern) {
    console.log(line);
  }
}

async function getMatchPatternWithLineNumber(
  pattern,
  currectPath,
  matchPattern,
  count,
) {
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    return fileEmpty;
  }

  const fileData = await readFile(currectPath);
  const lines = fileData.toString().split(/\r?\n/);
  for (let line of lines) {
    if (line.includes(pattern)) {
      const match = { text: line, lineNumber: count };
      matchPattern.push(match);
      count++;
    } else {
      count++;
    }
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  for (let line of matchPattern) {
    console.log(`${line.lineNumber}:${line.text}`);
  }
}

async function getNotMatchedPattern(pattern, currectPath, matchPattern) {
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    return fileEmpty;
  }

  const fileData = await readFile(currectPath);
  const lines = fileData.toString().split(/\r?\n/);
  for (let line of lines) {
    if (!line.includes(pattern)) {
      matchPattern.push(line);
    }
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  for (const line of matchPattern) {
    console.log(line);
  }
}

async function getMatchPattenInsideDir(pattern, matchPattern, currectPath) {
  let fileEmptyCount = 0;
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }
  const allFiles = await getAllFiles(currectPath);

  for (const file of allFiles) {
    const fileData = await readFile(file);
    const lines = fileData.toString().split(/\r?\n/);

    const fileEmpty = isFileEmpty(file);
    if (fileEmpty) {
      fileEmptyCount++;
    }

    for (let line of lines) {
      if (line.includes(pattern)) {
        const info = { lineContent: line, lineFilePath: file };
        matchPattern.push(info);
      }
    }
  }

  if (fileEmptyCount === allFiles.length) {
    console.log("All files are empty.");
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  for (let line of matchPattern) {
    console.log(line);
  }
}

async function countMatchPattern(pattern, currectPath) {
  let count = 0;
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    // return fileEmpty;
    return;
  }

  const fileData = await readFile(currectPath);

  const lines = fileData.toString().split(/\r?\n/);
  for (let line of lines) {
    if (line.includes(pattern)) {
      count++;
    }
  }

  if (count === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  console.log(count);
}

async function listFilenameMatches(pattern, currectPath, file) {
  let fileName;
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    // return fileEmpty;
    return;
  }

  const fileData = await readFile(currectPath);

  const lines = fileData.toString().split(/\r?\n/);

  for (let line of lines) {
    if (line.includes(pattern)) {
      fileName = file;
      break;
    }
  }

  if (fileName === "" || fileName === undefined) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  console.log(fileName);
}

async function matchWholeWord(pattern, currectPath, matchPattern) {
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    // return fileEmpty;
    return;
  }

  const fileData = await readFile(currectPath);

  const lines = fileData.toString().split(/\r?\n/);

  const regex = new RegExp(`\\b${pattern}\\b`);
  for (let line of lines) {
    if (regex.test(line)) {
      matchPattern.push(line);
    }
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  for (let line of matchPattern) {
    console.log(line);
  }
}

async function matchLinesPlusSpecificLinesAfter(
  specificLines,
  pattern,
  currectPath,
  matchPattern,
) {
  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    // return fileEmpty;
    return;
  }

  const fileData = await readFile(currectPath);

  const lines = fileData.toString().split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(pattern)) {
      matchPattern.push(line);
      let matchCount = i;
      for (let j = 0; j < specificLines; j++) {
        matchCount += 1;
        const nextLine = lines[matchCount];
        if (nextLine !== undefined) {
          matchPattern.push(nextLine.trim());
        }
      }
    }
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  for (let line of matchPattern) {
    console.log(line);
  }
}

async function matchLinesPlusSpecificLinesBefore(
  specificLines,
  pattern,
  currectPath,
  matchPattern,
) {
  console.log("specificLines are: ", specificLines);
  console.log("pattern are: ", pattern);
  console.log("currectPath are: ", currectPath);
  console.log("matchPattern are: ", matchPattern);

  const isFileExits = await checkFile(currectPath);
  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(currectPath);
  if (fileEmpty) {
    console.log("📂 File is empty.");
    // return fileEmpty;
    return;
  }

  const fileData = await readFile(currectPath);

  const lines = fileData.toString().split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(pattern)) {
      matchPattern.push(line);
      let matchCount = i;
      for (let j = 0; j < specificLines; j++) {
        matchCount -= 1;
        const nextLine = lines[matchCount];
        matchPattern.push(nextLine);
        if (nextLine !== undefined) {
          matchPattern.push(nextLine.trim());
        }
      }
    }
  }

  if (matchPattern.length === 0) {
    console.log("🔍❌ No matching pattern found.");
    return;
  }

  for (let line of matchPattern) {
    console.log(line);
  }
}

export {
  countMatchPattern,
  matchPatternIgnoreUpperAndLowerCase,
  getMatchPatternWithLineNumber,
  getNotMatchedPattern,
  getMatchPattenInsideDir,
  listFilenameMatches,
  matchWholeWord,
  matchLinesPlusSpecificLinesAfter,
  matchLinesPlusSpecificLinesBefore,
};
