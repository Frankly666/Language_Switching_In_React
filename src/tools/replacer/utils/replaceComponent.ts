import path from "path";
import fs from "fs";
import readline from "readline";

import type { IMapItem } from "../type";
import removeLineBreaks from "./removeLineBreaks";

async function replaceContentOfComponent(mapItem: IMapItem, newString: string) {
  let filePath = path.join(
    __dirname,
    `../../../../../fe_lib_international_tool/${mapItem.path}`
  );

  // 要替换的原始字符串
  let oldString = mapItem.raw;

  let lineNum = mapItem.lineNum; // 行号
  let isReplaced = false; // 标记是否已经替换了字符串

  // 调api
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let currentLine = 0;
  let fileLines: Array<string> = [];

  // 一行一行的读取(使用split("\n")会出现问题)
  rl.on("line", (line) => {
    if (currentLine === lineNum) {
      // 先去除最后的换行符(会影响替换)
      oldString = removeLineBreaks(oldString);
      newString = removeLineBreaks(newString);

      // 替换整个字符串
      const newLine = line.replace(oldString, newString);

      fileLines.push(newLine);
      isReplaced = true;
    } else {
      fileLines.push(line);
    }
    currentLine++; // 递增行号
  });

  rl.on("close", () => {
    if (isReplaced) {
      fs.writeFileSync(filePath, fileLines.join("\n"), { encoding: "utf8" });
    } else {
      console.log("未找到指定的字符串进行替换");
    }
  });

  rl.on("error", (err) => {
    console.error("读取文件时出错:", err);
  });
}

export default replaceContentOfComponent;
