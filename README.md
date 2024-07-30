# 代码国际化脚本

## 脚本的目标
在范围内遍历项目文件，找到拥有中文的代码行，生成中文字典用于翻译。运行交互式命令行工具，采用可设置的方式替换源代码。

## 如何工作
本工具有两个主要的脚本，extracter 与 replacer

### extractor
extract 会根据设定的 [includes]，[excludes] 遍历所在文件夹符合的所有文件内容，生成(1)中文字典 以及(2)溯源文件 map。

(1)中文字典 zh-cn.dic.json
``` typescript
interface Dic {
  [key: string]: string
}

{
  // "FilePathName-RowNum-ColNum": ",
  "components_Click_tsx-13-3": "百词斩",
  ...
}
```

(2)溯源文件 dic.map.json
``` typescript
interface MapItem {
  id: string,
  raw: string,
  chn: string,
  lineNum: number,
  startAt: number,
  length: number
}

[
  {
    id: "components_Click_tsx-13-3",
    raw: "<h1>百词斩</h1>",
    chn: "百词斩",
    lineNum: 13,
    startAt: 3,
    length: 3
  },
  ...
]
```

### replacer
交互式命令行工具 replacer 会根据用户配置的方法以及溯源文件替换原字符串。
执行结束后，用户应手动处理语法冲突。

用户可配置替换方式：
```js
const replacerArr = [
  (m: MapItem) => m.raw.splice(m.startAt - 1, m.length + 2, `t(${m.id})`), // 删除前后字符，替换为 t(linenumber)
  (m: MapItem) => m.raw.splice(m.startAt, m.length, `{t(${m.id})}`) // 替换为 t(linenumber)，再前后加上{}
]

```
