import type { IMapItem, IRuleFunction, IChoices } from "../type";

// 替换规则函数(可添加, 但需注意, 在添加解析规则后应在replaceSummary加上对应的总结, 建议最后一条应是"跳过选项的处理函数")
export const replaceRules: Array<IRuleFunction> = [
  (m: IMapItem) => {
    let chars = m.raw.split(""); // 转换为字符数组
    chars.splice(m.startAt - 1, m.length + 2, `t("${m.id}")`); // 进行splice操作
    return chars.join(""); // 转换回字符串
  },
  (m: IMapItem) => {
    let chars = m.raw.split("");
    chars.splice(m.startAt, m.length, `{t("${m.id}")}`);
    return chars.join("");
  },
  (m: IMapItem) => {
    let chars = m.raw.split("");
    let lastIndex = chars.lastIndexOf("\r");
    chars.splice(lastIndex, 0, `  // Fixme: 标记点  t("${m.id}")`);
    return chars.join("");
  },
  (m: IMapItem) => {
    let chars = m.raw.split("");
    chars.splice(m.startAt, m.length, "$"+`{t("${m.id}")}`);
    return chars.join("");
  },
  (m: IMapItem) => {
    let chars = m.raw.split("");
    chars.splice(m.startAt, m.length, ` + t("${m.id}") + `);
    return chars.join("");
  },
  // 这里可以添加其他解析规则......
  (m: IMapItem) => {
    let chars = m.raw.split(""); // 转换为字符数组
    chars.splice(m.startAt, m.length, `t("${m.id}")`); // 进行splice操作
    return chars.join(""); // 转换回字符串
  },

  // 此函数放在最后
  (m: IMapItem) => {
    return m.raw;
  },
];

// 对应的每条替换规则的总结, 最后一条为跳过
const replaceSummary: Array<string> = [
  "1. 删除前后字符再替换为 t(id)",
  "2. 替换为 t(id)，再前后加上{}",
  "3. 有点复杂打个标签先",
  "4. 替换为 t(id)，再加上${}",
  "5. 替换为 ' + t(id) + '",
  "6. 直接将文字替换成 t(id)",
  "7. 跳过这条"  // 此条放在最后与上面函数进行对应
];

const rulesOptions: Array<IChoices> = [];
// 预览处理函数
export function handlePreview(mapItem: IMapItem) {
  // 每次都要清空
  rulesOptions.splice(0, rulesOptions.length);

  for (let [index, value] of replaceRules.entries()) {
    // 转化一下更美观
    let name: string = replaceSummary[index];
    let description = ` 原句: ${mapItem.raw} \n 预览: ${value(mapItem)} `;

    // "跳过"操作就不用展示预览
    if(index === replaceRules.length - 1) description = ` 原句: ${mapItem.raw}`;

    rulesOptions.push({ name, value, description });
  }
}

export default rulesOptions;
