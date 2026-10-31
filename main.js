#!/usr/bin/env node
import { readdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import path from "node:path";

const arg = process.argv.slice(2);
if (arg.length === 3) {
  const argument1 = arg[0];
  const argument2 = arg[1];
  const argument3 = arg[2];
  matchingLinesDiff(argument1, argument2, argument3);
} else if (arg.length === 2) {
  const argument1 = arg[0];
  const argument2 = arg[1];
  findMatchingLines(argument1, argument2);
}

async function findMatchingLines(pattern, file) {
  let matchPattern = [];
  const fileData = await readFile(file);
  const lines = fileData.toString().split("\n");

  for (let line of lines) {
    if (line.includes(pattern)) {
      matchPattern.push(line);
    }
  }

  for (const line of matchPattern) {
    console.log(line);
  }
}

async function getAllFiles(folderPath, arrayOfFiles = []) {
  const entries = await readdir(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const filePath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }

  }
  return arrayOfFiles;
}

async function matchingLinesDiff(option, pattern, file) {
  let matchPattern = [];
  let count = 1;

  if (option === "-i") {
    const fileData = await readFile(file);
    const lines = fileData.toString().split("\n");

    for (let line of lines) {
      if (line.toLocaleLowerCase().includes(pattern.toLocaleLowerCase())) {
        matchPattern.push(line);
      }
    }

    for (const line of matchPattern) {
      console.log(line);
    }
  } else if (option === "-n") {
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

    for (const line of matchPattern) {
      console.log(`${line.lineNumber}:${line.text}`);
    }
  } else if (option === "-v") {
    const fileData = await readFile(file);
    const lines = fileData.toString().split("\n");

    for (let line of lines) {
      if (!line.includes(pattern)) {
        matchPattern.push(line);
      }
    }

    for (const line of matchPattern) {
      console.log(line);
    }

  } else if (option === "-r") {
    const allFiles = await getAllFiles(file);

    for (const file of allFiles) {
      const fileData = await readFile(file);
      const lines = fileData.toString().split("\n");

      for (let line of lines) {
        if (line.includes(pattern)) {
          const info = { lineContent: line, lineFilePath: file };
          matchPattern.push(info);
        }
      }
    }

    for (const line of matchPattern) {
      console.log(`${line.lineFilePath}:${line.lineContent}`);
    }
  }
}
