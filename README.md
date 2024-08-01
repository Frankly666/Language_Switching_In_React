# 代码国际化脚本

## >脚本的目标
在范围内遍历项目文件，找到拥有中文的代码行，生成中文字典用于翻译。运行交互式命令行工具，采用可设置的方式替换源代码。

## >如何工作
本工具有两个主要的脚本，extracter 与 replacer

### extractor
extract 会根据其文件头部设定的 includes，excludes 遍历所在文件夹符合的所有文件内容，生成(1)中文字典 以及(2)溯源文件 map。

(1)中文字典 zh-cn.dic.json 内容形如：
``` typescript
{
  // "FilePathName-RowNum-ColNum": ",
  "components_Click_tsx-13-3": "百词斩",
  ...
}
```

(2)溯源文件 dic.map.json 项目定义：
``` typescript
interface MapItem {
  pathname: string,
  id: string,
  raw: string,
  chn: string,
  lineNum: number,
  startAt: number,
  length: number
}
```

其内容形如：
``` typescript
[
  {
    pathname: 'components/Click.tsx',
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
交互式命令行工具 replacer 会根据用户配置的方法以及溯源文件 dic.map.json 替换原字符串。
执行结束后，用户应手动处理语法冲突。

用户可在 replacer 头部配置替换方式：
```js
const replaceRule = [
  (m: MapItem) => m.raw.splice(m.startAt - 1, m.length + 2, `t(${m.id})`), // 删除前后字符，替换为 t(linenumber)
  (m: MapItem) => m.raw.splice(m.startAt, m.length, `{t(${m.id})}`), // 替换为 t(linenumber)，再前后加上{}
  (m: MapItem) => m.raw + `// Fixme: 这段手动改 t(${m.id})`,
  (m: MapItem) => m.raw.splice(m.startAt, m.length, `$\{t(${m.id})}`), // 替换为 t(linenumber)，再前后加上${}
]

```

## >如何使用

- 由于脚本的不可控性，修改前注意 commit
- 将两个脚本复制到需要处理的文件放到需要处理的工程根目录
- 修改 extractor.config.js 配置的 include 和 exclude，选择需要遍历的文件和排除项
- 运行 extractor 脚本，即可在当前文件夹获得 zh-cn.dic.json 与 dic.map.json 文件。至此，获得了中文字典可供国际化翻译。
- 修改 replacer 脚本头部的 replaceRule，配置可能的替换方式
- 运行 replacer 脚本，交互式命令行会逐一询问并修改源文件，直至全部完成

## >工具使用指南

### extractor:
- 把需要翻译的工程放入src下面
- 启动项目npm run extracter
- 会构建出一个dist文件,包含中文所在的映射(map), 行内原文(row)

### replacer:
* 正式运行之前需要进行相关配置
```
    1. 进入 src/tools/replacer/config/tagetFilesPath 文件去配置由extractor构建出来的map文件与row文件的路径.
    2. 目标替换的工程文件应放在src目录下(工程文件直接放入src目录顶层), 此项由extractor工具导出的map文件决定.
```
* 使用ts-node运行或者将ts编译后运行 src/tools/replacer/index.ts 入口文件.(也可直接运行npm run replace)
* 可在 src/tools/config/replaceRules.ts 中增添或修改替换方式

#### 注意与提示:
  1.  此工具只实现了将相关代码行的**文字替换为映射函数**, 但是并没有将映射函数导入工程文件.
  2.  使用者可**自己编写**映射函数或者**使用此工具已经封装的相关类**(src/tools/replacer/urils/dicMap.ts)
  3.  另外该工具会记录已修改的代码行, 若想要重新进行修改, 需进入 src/tools/replacer/modifyHistory/history.json 中手动删除记录
