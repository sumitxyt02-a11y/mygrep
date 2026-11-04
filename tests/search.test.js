import path, { dirname } from "path";
import { findMatchingLines, matchingLinesDiff } from "../src/search.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("findMatchingLines()", () => {
  test("should find matching lines in an existing file", async () => {
    // Arrange
    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "notes.txt");

    // Act
    const result = await findMatchingLines(pattern, notesFile);

    // Assert
    expect(result).toEqual(["I am learning JavaScript", "I am learning grep"]);
  });

  test("should return false when file does not exit", async () => {
    // Arrange

    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "harry.txt");

    // Act
    const result = await findMatchingLines(pattern, notesFile);

    // Assert
    expect(result).toBe(false);
  });

  test("should return true when file is empty", async () => {
    // Arrange

    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "notes.txt");

    // Act
    const result = await findMatchingLines(pattern, notesFile);

    // Assert
    expect(result).toBe(true);
  });
});

describe("matchingLinesDiff()", () => {
  test("should find matching lines in an existing file and Ignores uppercase/lowercase differences", async () => {
    // Arrange
    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "notes.txt");

    // Act
    const result = await matchingLinesDiff("-i", pattern, notesFile);

    // Assert
    expect(result).toEqual([
      "I am learning JavaScript",
      "I am learning grep",
      "Learning to code is fun",
    ]);
  });

  test("should find matching lines in an existing file and Show line numbers", async () => {
    // Arrange
    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "notes.txt");

    // Act
    const result = await matchingLinesDiff("-n", pattern, notesFile);

    // Assert
    expect(result).toEqual([
      { text: "I am learning JavaScript", lineNumber: 1 },
      { text: "I am learning grep", lineNumber: 4 },
    ]);
  });

  test("should find matching lines in an existing file and Invert matching", async () => {
    // Arrange
    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "notes.txt");

    // Act
    const result = await matchingLinesDiff("-v", pattern, notesFile);

    // Assert
    expect(result).toEqual([
      "I love programming",
      "Python is easy",
      "Programming is fun",
      "Learning to code is fun",
    ]);
  });

  test("should find matching lines in an existing file and Invert matching", async () => {
    // Arrange
    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "notes.txt");

    // Act
    const result = await matchingLinesDiff("-v", pattern, notesFile);

    // Assert
    expect(result).toEqual([
      "I love programming",
      "Python is easy",
      "Programming is fun",
      "Learning to code is fun",
    ]);
  });

  test("should find matching lines in an existing file and Searches files inside a directory recursively", async () => {
    // Arrange
    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "notes.txt");

    // Act
    const result = await matchingLinesDiff("-r", pattern, notesFile);

    // Assert
    expect(result).toEqual([
      {
        lineContent:
          '    console.error("Usage: mygrep [option] [patterns] [file]");',
        lineFilePath:
          "C:\\Users\\ashu\\Downloads\\problem solving projects\\Build your own grep\\src\\parsing.js",
      },
    ]);
  });

  test("should return false when file does not exit", async () => {
    // Arrange

    const pattern = "learning";
    const notesFile = path.join(__dirname, "..", "harry.txt");

    // Act
    const result = await findMatchingLines(pattern, notesFile);

    // Assert
    expect(result).toBe(false);
  });

  // test("should return true when file is empty", async () => {
  //   // Arrange

  //   const pattern = "learning";
  //   const notesFile = path.join(__dirname, "..", "notes.txt");

  //   // Act
  //   const result = await findMatchingLines(pattern, notesFile);

  //   // Assert
  //   expect(result).toBe(true);
  // });
});
