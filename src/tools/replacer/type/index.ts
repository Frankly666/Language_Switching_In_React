// 类型定义
export interface IMapItem {
  path: string;
  id: string;
  raw: string;
  chn: string;
  lineNum: number;
  startAt: number;
  length: number;
}

export interface IRuleFunction {
  (m: IMapItem): string;
}

export interface IChoices {
  name:  string;
  value: IRuleFunction;
  description: string;
}

// 这个两种不同类型的json文件解析后得到的类型
export type IDicJsonFile = string[];
export type IMapJsonFile = IMapItem[];