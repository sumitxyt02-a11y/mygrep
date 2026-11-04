function parseCLI() {
  const arg = process.argv.slice(2);

  if (process.argv.length < 4) {
    console.error("❌ Error: Missing required arguments.");
    console.error("Usage: mygrep [option] [patterns] [file]");
    process.exit(1);
  }

  return arg
}


export {parseCLI}