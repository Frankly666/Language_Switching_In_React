function removeLineBreaks (str: string): string {
  // 先去除每个字符串后面的换行符然后再进行替换
  let strTem = str.split("")
  strTem.pop();
  str = strTem.join("");
  return str;
}

export default removeLineBreaks;