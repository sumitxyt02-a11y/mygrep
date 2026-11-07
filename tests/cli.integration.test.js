import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs/promises";
import os from "os";
import { promisify } from "util";
import { execFile } from "child_process";

const execFilePromise = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(__dirname, "..", "src/main.js");

let testdir;
let notesFile;

beforeEach(async () => {
  testdir = await fs.mkdtemp(path.join(os.tmpdir(), "test-"));

  notesFile = path.join(testdir, "notes.txt");
});

afterEach(async () => {
  await fs.rm(testdir, { recursive: true, force: true });
});

async function checkFileNotExit(cliPath, option, pattern, filePath) {
  await expect(
    execFilePromise("node", [cliPath, option, pattern, filePath]),
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining("❌ File not exits."),
  });
}

async function checkFileEmpty(cliPath, option, pattern, filePath) {
  const result = await execFilePromise("node", [
    cliPath,
    option,
    pattern,
    filePath,
  ]);

  expect(result.stdout).toContain("📂 File is empty.");
}

async function checkFolderFileEmpty(cliPath, option, pattern, filePath) {
  const result = await execFilePromise("node", [
    cliPath,
    option,
    pattern,
    filePath,
  ]);

  expect(result.stdout).toContain("All files are empty.");
}

async function matchingPatternNotFound(cliPath, option, pattern, filePath) {
  const result = await execFilePromise("node", [
    cliPath,
    option,
    pattern,
    filePath,
  ]);

  expect(result.stdout).toContain("🔍❌ No matching pattern found.");
}

async function missingArguments(cliPath, option) {
  await expect(
    execFilePromise("node", [cliPath, option]),
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining("Missing required arguments."),
  });
}

async function checkFileNotExitforSurrondingLines(
  cliPath,
  option,
  specificLines,
  pattern,
  filePath,
) {
  await expect(
    execFilePromise("node", [
      cliPath,
      option,
      specificLines,
      pattern,
      filePath,
    ]),
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining("❌ File not exits."),
  });
}

async function checkFileEmptyforSurroundingLines(
  cliPath,
  option,
  specificLines,
  pattern,
  filePath,
) {
  const result = await execFilePromise("node", [
    cliPath,
    option,
    specificLines,
    pattern,
    filePath,
  ]);

  expect(result.stdout).toContain("📂 File is empty.");
}

async function matchingPatternNotFoundForSurroundingLines(
  cliPath,
  option,
  specificLines,
  pattern,
  filePath,
) {
  const result = await execFilePromise("node", [
    cliPath,
    option,
    specificLines,
    pattern,
    filePath,
  ]);

  expect(result.stdout).toContain("🔍❌ No matching pattern found.");
}

// test for command: mygrep [pattern] [file]
describe(" mygrep [pattern] [file] (line match)", () => {
  test("should find matching lines in a file", async () => {
    await fs.writeFile(
      notesFile,
      "I am learning JavaScript\nI am learning grep\nHello World",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "learning",
      notesFile,
    ]);

    expect(result.stdout).toContain("I am learning JavaScript");
    expect(result.stdout).toContain("I am learning grep");
    expect(result.stdout).not.toContain("Hello World");
  });

  test("should prints an error when the file does not exist", async () => {
    await fs.writeFile(
      notesFile,
      "I am learning JavaScript\nI am learning grep\nHello World",
      "utf8",
    );
    await expect(
      execFilePromise("node", [cliPath, "learning", "harry.txt"]),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining("❌ File not exits."),
    });
  });

  test("should prints an error when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    const result = await execFilePromise("node", [
      cliPath,
      "learning",
      notesFile,
    ]);

    expect(result.stdout).toContain("📂 File is empty.");
  });

  test("should prints an error when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "I am learning JavaScript\nI am learning grep\nHello World",
      "utf8",
    );
    const result = await execFilePromise("node", [cliPath, "hello", notesFile]);

    expect(result.stdout).toContain("🔍❌ No matching pattern found.");
  });

  test("should prints an error when the arguments are missing", async () => {
    await expect(
      execFilePromise("node", [cliPath, "hello"]),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining("Missing required arguments."),
    });
  });
});

// test for command: mygrep [option] [pattern] [file]
// Ignore lowercase and uppercase difference

describe("mygrep -i (mathcing line)", () => {
  test("should prints the matching lines and ignore uppercase/lowercase difference", async () => {
    await fs.writeFile(
      notesFile,
      "I am learning JavaScript\nI am learning grep\nLearning python\nLEARNING to code\nHello World",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-i",
      "learning",
      notesFile,
    ]);

    expect(result.stdout).toContain("I am learning JavaScript");
    expect(result.stdout).toContain("I am learning grep");
    expect(result.stdout).toContain("Learning python");
    expect(result.stdout).toContain("LEARNING to code");
    expect(result.stdout).not.toContain("Hello World");
  });

  test("should prints the matching lines and not ignore uppercase/lowercase difference", async () => {
    await fs.writeFile(
      notesFile,
      "I am learning JavaScript\nI am learning grep\nLearning python\nLEARNING to code\nHello World",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "learning",
      notesFile,
    ]);

    expect(result.stdout).toContain("I am learning JavaScript");
    expect(result.stdout).toContain("I am learning grep");
    expect(result.stdout).not.toContain("Hello World");
    expect(result.stdout).not.toContain("Learning python");
    expect(result.stdout).not.toContain("LEARNING to code");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExit(cliPath, "-i", "learning", missing);
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmpty(cliPath, "-i", "learning", notesFile);
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "I am learning JavaScript\nI am learning grep\nLearning python\nHello World",
      "utf8",
    );
    await matchingPatternNotFound(cliPath, "-i", "good", notesFile);
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-i");
  });
});

// test for command: mygrep [option] [pattern] [file]
// matching lines with line number

describe("mygrep -n (line numbers)", () => {
  test("should prints the matching line with line number", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-n",
      "Hello",
      notesFile,
    ]);

    expect(result.stdout).toContain("1:Hello world");
    expect(result.stdout).toContain("3:Hello Node.js");
    expect(result.stdout).toContain("5:Hello developers");
    expect(result.stdout).not.toContain("I love JavaScript");
    expect(result.stdout).not.toContain("Learning programming");
  });

  test("should prints the matching lines and not give line number", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    const result = await execFilePromise("node", [cliPath, "Hello", notesFile]);

    expect(result.stdout).toContain("Hello world");
    expect(result.stdout).toContain("Hello Node.js");
    expect(result.stdout).toContain("Hello developers");
    expect(result.stdout).not.toContain("I love JavaScript");
    expect(result.stdout).not.toContain("Learning programming");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExit(cliPath, "-n", "Hello", missing);
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmpty(cliPath, "-n", "learning", notesFile);
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    await matchingPatternNotFound(cliPath, "-n", "good", notesFile);
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-n");
  });
});

// test for command: mygrep [option] [pattern] [file]
// get not matching lines

describe("mygrep -v (invert match)", () => {
  test("should get lines that does not contain pattern", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-v",
      "Hello",
      notesFile,
    ]);

    expect(result.stdout).toContain("I love JavaScript");
    expect(result.stdout).toContain("Learning programming");
    expect(result.stdout).not.toContain("Hello world");
    expect(result.stdout).not.toContain("Hello Node.js");
    expect(result.stdout).not.toContain("Hello developers");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExit(cliPath, "-v", "Hello", missing);
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmpty(cliPath, "-v", "learning", notesFile);
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-v");
  });
});

// test for command: mygrep [option] [pattern] [file]
// matching lines inside subfolder

describe("mygrep -r (recursive match)", () => {
  test("should prints the matching lines in subfolder", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-r",
      "Hello",
      testdir,
    ]);

    expect(result.stdout).toContain("Hello world");
    expect(result.stdout).toContain("Hello Node.js");
    expect(result.stdout).toContain("Hello developers");
    expect(result.stdout).not.toContain("I love JavaScript");
    expect(result.stdout).not.toContain("Learning programming");
  });

  test("should fail when the file does not exist", async () => {
    const missingDir = path.join(process.cwd(), "missing-directory");
    await checkFileNotExit(cliPath, "-r", "Hello", missingDir);
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFolderFileEmpty(cliPath, "-r", "learning", testdir);
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    await matchingPatternNotFound(cliPath, "-r", "good", testdir);
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-r");
  });
});

// test for command: mygrep [option] [pattern] [file]
// count matching lines
describe("mygrep -c (count match)", () => {
  test("should print matching line count", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-c",
      "Hello",
      notesFile,
    ]);

    expect(result.stdout).toContain("3");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExit(cliPath, "-c", "Hello", missing);
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmpty(cliPath, "-c", "learning", notesFile);
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    await matchingPatternNotFound(cliPath, "-c", "good", notesFile);
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-c");
  });
});

// test for command: mygrep [option] [pattern] [file]
// list filenames with matches

describe("mygrep -l (list filenames)", () => {
  test("should print list filenames with matches", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-l",
      "Hello",
      notesFile,
    ]);

    expect(result.stdout).toContain("notes.txt");
    expect(result.stdout).not.toContain("Hello world");
    expect(result.stdout).not.toContain("I love JavaScript");
    expect(result.stdout).not.toContain("Hello Node.js");
    expect(result.stdout).not.toContain("Learning programming");
    expect(result.stdout).not.toContain("Hello developers");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExit(cliPath, "-l", "Hello", missing);
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmpty(cliPath, "-l", "learning", notesFile);
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "Hello world\nI love JavaScript\nHello Node.js\nLearning programming\nHello developers",
      "utf8",
    );
    await matchingPatternNotFound(cliPath, "-l", "good", notesFile);
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-l");
  });
});

// test for command: mygrep [option] [pattern] [file]
// match whole words
describe("mygrep -w (match whole words)", () => {
  test("should print line matches whole words", async () => {
    await fs.writeFile(
      notesFile,
      "I love fruit.\nGrapefruit is bitter.\nThe dragonfruit looks cool.\nThis fruit-basket is heavy.",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-w",
      "fruit",
      notesFile,
    ]);

    expect(result.stdout).toContain("I love fruit.");
    expect(result.stdout).toContain("This fruit-basket is heavy.");
    expect(result.stdout).not.toContain("Grapefruit is bitter.");
    expect(result.stdout).not.toContain("The dragonfruit looks cool.");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExit(cliPath, "-w", "Hello", missing);
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmpty(cliPath, "-w", "learning", notesFile);
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "I love fruit.\nGrapefruit is bitter.\nThe dragonfruit looks cool.\nThis fruit-basket is heavy.",
      "utf8",
    );
    await matchingPatternNotFound(cliPath, "-w", "good", notesFile);
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-w");
  });
});

// test for command: mygrep [option] [pattern] [file]
// display surronding lines
describe("mygrep -A (print line after match)", () => {
  test("should print matching line count", async () => {
    await fs.writeFile(
      notesFile,
      "Database Server:\nIP: 192.168.1.10\nStatus: Active\nWeb Server:\nIP: 192.168.1.20\nStatus: Down",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-A",
      2,
      "Web Server",
      notesFile,
    ]);

    expect(result.stdout).toContain("Web Server:");
    expect(result.stdout).toContain("IP: 192.168.1.20");
    expect(result.stdout).toContain("Status: Down");
    expect(result.stdout).not.toContain("Database Server:");
    expect(result.stdout).not.toContain("IP: 192.168.1.10");
    expect(result.stdout).not.toContain("Status: Active");
  });

  test("should print matching line and after match surronding lines", async () => {
    await fs.writeFile(
      notesFile,
      "Database Server:\nIP: 192.168.1.10\nStatus: Active\nWeb Server:\nIP: 192.168.1.20\nStatus: Down",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-A",
      100,
      "Web Server",
      notesFile,
    ]);

    expect(result.stdout).toContain("Web Server:");
    expect(result.stdout).toContain("IP: 192.168.1.20");
    expect(result.stdout).toContain("Status: Down");
    expect(result.stdout).not.toContain("Database Server:");
    expect(result.stdout).not.toContain("IP: 192.168.1.10");
    expect(result.stdout).not.toContain("Status: Active");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExitforSurrondingLines(
      cliPath,
      "-A",
      2,
      "Hello",
      missing,
    );
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmptyforSurroundingLines(
      cliPath,
      "-A",
      2,
      "learning",
      notesFile,
    );
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "Database Server:\nIP: 192.168.1.10\nStatus: Active\nWeb Server:\nIP: 192.168.1.20\nStatus: Down",
      "utf8",
    );
    await matchingPatternNotFoundForSurroundingLines(
      cliPath,
      "-A",
      2,
      "good",
      notesFile,
    );
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-A");
  });
});

// test for command: mygrep [option] [pattern] [file]
// display surronding lines
describe("mygrep -B (print line after match)", () => {
  test("should print matching line count", async () => {
    await fs.writeFile(
      notesFile,
      "Database Server:\nIP: 192.168.1.10\nStatus: Active\nWeb Server:\nIP: 192.168.1.20\nStatus: Down",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-B",
      2,
      "Web Server",
      notesFile,
    ]);

    expect(result.stdout).toContain("Web Server:");
    expect(result.stdout).toContain("Status: Active");
    expect(result.stdout).toContain("IP: 192.168.1.10");
    expect(result.stdout).not.toContain("Database Server:");
    expect(result.stdout).not.toContain("IP: 192.168.1.20");
    expect(result.stdout).not.toContain("Status: Down");
  });

  test("should print matching line and before match surronding lines", async () => {
    await fs.writeFile(
      notesFile,
      "Database Server:\nIP: 192.168.1.10\nStatus: Active\nWeb Server:\nIP: 192.168.1.20\nStatus: Down",
      "utf8",
    );
    const result = await execFilePromise("node", [
      cliPath,
      "-B",
      100,
      "Web Server",
      notesFile,
    ]);

    expect(result.stdout).toContain("Web Server:");
    expect(result.stdout).toContain("Status: Active");
    expect(result.stdout).toContain("IP: 192.168.1.10");
    expect(result.stdout).toContain("Database Server:");
    expect(result.stdout).not.toContain("IP: 192.168.1.20");
    expect(result.stdout).not.toContain("Status: Down");
  });

  test("should fail when the file does not exist", async () => {
    const missing = path.join(testdir, "missing.txt");
    await checkFileNotExitforSurrondingLines(
      cliPath,
      "-B",
      2,
      "Hello",
      missing,
    );
  });

  test("should prints a message when the file is empty", async () => {
    await fs.writeFile(notesFile, "", "utf8");
    await checkFileEmptyforSurroundingLines(
      cliPath,
      "-B",
      2,
      "learning",
      notesFile,
    );
  });

  test("should prints a message when the matching pattern not found", async () => {
    await fs.writeFile(
      notesFile,
      "Database Server:\nIP: 192.168.1.10\nStatus: Active\nWeb Server:\nIP: 192.168.1.20\nStatus: Down",
      "utf8",
    );
    await matchingPatternNotFoundForSurroundingLines(
      cliPath,
      "-B",
      2,
      "good",
      notesFile,
    );
  });

  test("should prints an error when the arguments are missing", async () => {
    await missingArguments(cliPath, "-B");
  });
});
