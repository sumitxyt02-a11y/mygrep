import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folder = path.join(__dirname, "src");

async function getAllFiles(folder, arrayOfFiles = []) {
  console.log("runs");

  const entries = await readdir(folder, { withFileTypes: true });
  console.log("entries are: ", entries);

  for (const entry of entries) {
    console.log("all entriesa are in loop: ", entry)
    const fullPath = path.join(folder, entry.name);

    if (entry.isDirectory()) {
      arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

async function getMatchingPattern(pattern, folder) {
  let match = [];

  const allFiles = await getAllFiles(folder);

  for (const file of allFiles) {
    const fileData = await readFile(file);
    console.log("file data is: ", fileData);
    const lines = fileData.toString().split("\n");
    console.log("split lines are: ", lines);

    for (const line of lines) {
      if (line.includes(pattern)) {
        match.push(line);
      }
    }
  }

  console.log("\n")
  console.log("matches inside the folder")
  for (const line of match) {
    console.log(line);
  }
}

getMatchingPattern("hello", folder);
