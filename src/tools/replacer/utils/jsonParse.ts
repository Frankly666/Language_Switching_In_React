import fs from "fs/promises";

import type {
  IMapItem,
  IMapJsonFile,
  IDicJsonFile,
} from "@/tools/replacer/type";

// 读取并解析 JSON 文件的函数
export const readAndParseJsonFile = async (
  filePath: string
): Promise<IMapJsonFile | IDicJsonFile> => {
  try {
    // 读取文件内容
    const data = await fs.readFile(filePath, "utf8");
    // 解析 JSON 数据
    const json = JSON.parse(data);
    return json;
  } catch (error) {
    console.error("读取或解析 JSON 文件时出错:", error);
    throw error;
  }
};

// // 执行读取操作
// export const getJson = async (jsonFilePath: string): Promise<IMapJsonFile | IDicJsonFile> => {
//   try {
//     const jsonData = await readAndParseJsonFile(jsonFilePath);
//     return jsonData;
//   } catch (error) {
//     console.error('主函数执行出错:', error);
//     throw error;
//   }
// };
