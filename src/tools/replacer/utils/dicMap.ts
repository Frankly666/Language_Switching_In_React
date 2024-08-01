import type { IDicJsonFile } from "../type";

// 字典映射类, 可为每个单独的页面配置自己的字典
class DicMapManager {
  private dic: IDicJsonFile = [];

  constructor(initialDic?: IDicJsonFile) {
    if (initialDic) {
      this.dic = initialDic;
    }
  }

  // 设置当前的映射字典
  setDic(newDic: IDicJsonFile) {
    this.dic = newDic;
  }

  // 根据id获取映射的值
  dicMap(id: string): string | null {
    for (let item of this.dic) {
      let key: string = Object.keys(item)[0];
      let value: string = Object.values(item)[0];
      if (key === id) {
        return value;
      }
    }
    return null;
  }
}

export default DicMapManager;
