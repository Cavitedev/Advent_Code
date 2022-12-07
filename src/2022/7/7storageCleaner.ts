import { default as fs } from "fs";
import { default as readline } from "readline";
import { Terminal } from "./terminal.js";

export async function foldersBelowThresholdTotalSize(
  threshold: number,
  file: String = "input.txt"
): Promise<number> {
  const rl = readFileByLine(file);

  const terminal = new Terminal();

  for await (const line of rl) {
    terminal.readLine(line);
  }

  const foldersSizeUnderThreshold =
    terminal.fileExplorer.rootFolder.sumFolderSizesBelowThreshold(threshold);
  return foldersSizeUnderThreshold;
}

function readFileByLine(file: String): readline.Interface {
  const fileStream = fs.createReadStream("src/2022/7/" + file, {
    encoding: "utf8",
  });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  return rl;
}
