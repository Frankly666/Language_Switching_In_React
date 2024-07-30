const hanRegex = /[^//][\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}]+/u
const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\/|^\s*\*.*/;
// const mulCommentMid = //;

function hasCh(str) {
  // if(mulCommentMid.test(str)) return false;
  str = str.replace(commentRegex, '');
  return hanRegex.test(str)
}

describe('忽略注释的几种情况', () => {
  it('正常单行注释-有中文', () => {
    expect(hasCh('// 123中文')).toBe(false)
  })
  it('没有注释', () => {
    expect(hasCh('中文')).toBe(true)
  })
  it('多行注释-有中文', () => {
    expect(hasCh('/** sad我是中文asdsa **/')).toBe(false)
  })
  it('多行注释-无中文', () => {
    expect(hasCh('/** asdx zcv 156**/')).toBe(false)
  })
  it('正常单行注释-中文前置', () => {
    expect(hasCh('中文 // 123中文')).toBe(true)
  })
  it('正常多行注释-中文前置', () => {
    expect(hasCh('中文 /** sad我是中文asdsa **/')).toBe(true)
  })
  it('带星号开头的', () => {
    expect(hasCh('* asd中文saxzc')).toBe(false)
  })
  it('带星号开头的-前面有空格的', () => {
    expect(hasCh('      * asd中文saxzc')).toBe(false)
  })
})