import { IDicJsonFile, IMapItem } from "./type";
import { getFiles } from "./utils/fileDirRead";
import { readAndParseJsonFile } from "./utils/jsonParse";
import { history, loadHistory } from "./utils/preserveProgress";
import { printDivider } from "./utils/printDivider";
import { replacer } from "./utils/replacer";

//  首先需要拿到每一条的数据, 然后根据数据进行命令行操作
async function main() {
  const jsonFiles = await getFiles();
  if (!jsonFiles) throw new Error("该文件夹中没有文件!");
  const { mapFiles, dicFiles } = jsonFiles;

  // 只需要加载一次history
  loadHistory();
  printDivider();

  for (let i = 0; i < mapFiles.length; i++) {
    const mapMessage = await readAndParseJsonFile(mapFiles[i]);
    const dicMessage = await readAndParseJsonFile(dicFiles[i]);

    for (let j = 0; j < Object.keys(mapMessage).length; j++) {
      let mapItem = mapMessage[j] as IMapItem;

      // 跳过那些已经修改过的元素
      if (history[mapItem.id]) continue;

      // 进行每行的替换操作
      await replacer(mapItem, dicMessage as IDicJsonFile);
    }
  }
  console.log("所有字符串处理完毕。");
}

main();
