import { access, constants, stat } from "node:fs/promises";

async function checkFile(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (error) {
    console.error("❌ File not exits.");
    process.exit(1);
   
  }
}

async function isFileEmpty(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.size === 0;
  } catch (error) {
    console.error("Error reading file stat: ", error);
    throw error;
  }
}

export { checkFile, isFileEmpty };
