import fs from "fs";
import path from "path";

// 假设历史记录存储在当前目录下的 'history.json' 文件中
const historyFilePath = path.join(__dirname, "../modifyHistory/history.json");

// 初始空对象，用于存储历史记录
export let history: { [id: string]: boolean } = {};

// 读取历史记录的同步函数, 这里需要同步的读取, 不然会有问题
export function loadHistory() {
  try {
    // 同步读取文件内容
    const data = fs.readFileSync(historyFilePath, "utf8");
    if (data.trim() === "") {
      history = {};
    } else {
      try {
        history = JSON.parse(data);
      } catch (parseErr) {
        console.error("解析历史记录时出错:", parseErr);
        // 设置默认的历史记录对象
        history = {};
      }
    }
  } catch (err) {
    console.error("读取历史记录时出错:", err);
    // 可以选择设置为空对象或其他默认值
    history = {};
  }
}

// 保存进度的异步函数
export function preserveProgress(id: string) {
  // 添加新记录
  history[id] = true;

  // 将历史记录对象转换为JSON字符串并写入文件
  const dataToWrite = JSON.stringify(history, null, 2);
  fs.writeFile(historyFilePath, dataToWrite, "utf8", (err) => {
    if (err) {
      console.error("写入历史记录时出错:", err);
    } else {
      // console.log("\n历史记录已更新");
    }
  });
}
