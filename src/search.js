import { readFile } from "fs/promises";
import { getAllFiles } from "./file-discovery.js";
import { checkFile, isFileEmpty } from "./utils/helper.js";
import path from "path";

async function findMatchingLines(pattern, file) {
  const currectPath = path.resolve(file);

  let matchPattern = [];
  const isFileExits = await checkFile(currectPath);

  if (!isFileExits) {
    return isFileExits;
  }

  const fileEmpty = await isFileEmpty(file);

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

async function matchingLinesDiff(option, pattern, file) {
  let matchPattern = [];
  let count = 1;

  const currectPath = path.resolve(file);
  console.log("current folder is: ", currectPath);

  if (option === "-i") {
    const isFileExits = await checkFile(file);
    if (!isFileExits) {
      return isFileExits;
    }

    const fileEmpty = await isFileEmpty(file);
    if (fileEmpty) {
      console.log("📂 File is empty.");
      // return fileEmpty;
      return;
    }

    const fileData = await readFile(file);
    const lines = fileData.toString().split("\n");
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
  } else if (option === "-n") {
    const isFileExits = await checkFile(file);
    if (!isFileExits) {
      return isFileExits;
    }

    const fileEmpty = await isFileEmpty(file);
    if (fileEmpty) {
      console.log("📂 File is empty.");
      return fileEmpty;
    }

    const fileData = await readFile(file);
    const lines = fileData.toString().split("\n");
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
  } else if (option === "-v") {
    const isFileExits = await checkFile(file);
    if (!isFileExits) {
      return isFileExits;
    }

    const fileEmpty = await isFileEmpty(file);
    if (fileEmpty) {
      console.log("📂 File is empty.");
      return fileEmpty;
    }

    const fileData = await readFile(file);
    const lines = fileData.toString().split("\n");
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
  } else if (option === "-r") {
    let fileEmptyCount = 0;
    const isFileExits = await checkFile(file);
    if (!isFileExits) {
      return isFileExits;
    }
    const allFiles = await getAllFiles(currectPath);

    for (const file of allFiles) {
      const fileData = await readFile(file);
      const lines = fileData.toString().split("\n");

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
}

export { findMatchingLines, matchingLinesDiff };
