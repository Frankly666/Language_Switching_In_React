import { select } from "@inquirer/prompts";

import rulesOptions, {
  handlePreview,
  replaceRules,
} from "../config/replaceRules";
import type { IMapItem, IDicJsonFile } from "@/tools/replacer/type";
import { printDivider } from "./printDivider";
import { setDic } from "./dicMap";
import replaceContentOfComponent from "./replaceComponent";
import { preserveProgress } from "./preserveProgress";

// ANSI 颜色代码示例
const RESET = "\x1b[0m"; // 重置所有样式
const GREEN = "\x1b[32m"; // 绿色

export async function replacer(mapItem: IMapItem, dic: IDicJsonFile) {
  let raw = mapItem.raw;

  // 设置当前的字典
  setDic(dic);
  // 设置当前的预览
  handlePreview(mapItem);

  // 使用 ANSI 颜色代码给原句添加颜色
  const coloredRaw = `${GREEN}${raw}${RESET}`;

  // 这里直接拿到解析规则
  if (rulesOptions) {
    const answer = await select({
      message: `原句为:${coloredRaw}\n请选择匹配的解析规则:`,
      choices: rulesOptions,
    });
    let newRaw = answer(mapItem);

    // 最终去替换组件页面中的文字
    replaceContentOfComponent(mapItem, newRaw);

    // 判断一下是否需要跳过
    let isSkip =
      replaceRules.findIndex((item) => item === answer) ===
      replaceRules.length - 1;

    // 修改过的加入历史记录
    if (!isSkip) {
      preserveProgress(mapItem.id);
      const resultRaw = `${GREEN}${newRaw}${RESET}`;
      console.log("修改后的结果: ", resultRaw);
    }
    printDivider();
  }
}
