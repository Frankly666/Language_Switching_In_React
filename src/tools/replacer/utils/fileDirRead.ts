import fs from 'fs/promises';
import path from 'path';

// 如果更改了相应的文件夹位置,需要到config中修改
import { MAP_DIRECTORY_PATH, DIC_DIRECTORY_PATH } from '../config/targetFilesPath';

// 读取文件夹中的所有文件，返回一个包含文件路径的数组
const readDirectoryFiles = async (dir: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // 如果是目录，则递归调用 readDirectoryFiles, 但我觉得应该没有这种情况
        files.push(...(await readDirectoryFiles(entryPath)));
      } else if (entry.isFile()) {
        // 如果是文件，则添加到 files 数组
        files.push(entryPath);
      }
    }

    return files;
  } catch (error) {
    console.error('读取文件夹时出错:', error);
    throw error;
  }
};

// 执行读取操作
export const getFiles = async () => {
  try {
    const mapFiles = await readDirectoryFiles(MAP_DIRECTORY_PATH);
    const dicFiles = await readDirectoryFiles(DIC_DIRECTORY_PATH);
    return {mapFiles, dicFiles}
  } catch (error) {
    console.error('文件读取的主函数执行出错:', error);
  }
};
