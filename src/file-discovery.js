import { readdir } from "node:fs/promises";
import path from "node:path";

async function getAllFiles(folderPath, arrayOfFiles = []) {
  const entries = await readdir(folderPath, { withFileTypes: true });
  console.log("all entries are: ", entries)
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

export {getAllFiles}