const fs = require('fs')
const path = require('path')
const glob = require('glob')
const hanRegex = /[，。？《》「」【】（）、·～！\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}]+/u
const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\/|^\s*\*.*/;
const config = require('./extractor.config')

if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true })
  const distPath = path.resolve('dist')
fs.mkdirSync(distPath)
const distRowPath = path.resolve(distPath, 'row')
fs.mkdirSync(distRowPath)
const distMapPath = path.resolve(distPath, 'map')
fs.mkdirSync(distMapPath)

const entryPath = 'src/'

function checked(curProject, map, row) {
  const filePaths = glob.sync(config.include.map(value => curProject+ value), {ignore: config.exclude})
  for(const filePath of filePaths) {
    const content = fs.readFileSync(filePath, 'utf-8').toString()
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const str = line.replace(commentRegex, '');
      if (hanRegex.test(str)) {
        let _line = line;
        while (_line.match(hanRegex)) {
          let ChWordInfo = _line.match(hanRegex)
          const id = `${filePath.replace(/[\/\\\.]/g, '_')}-${i}-${ChWordInfo.index}`.slice(4)
          row.push({
            [id]: ChWordInfo[0]
          })
          _line = _line.replace(hanRegex, new Array(ChWordInfo[0].length).fill('-').join(''))
          map.push({
            path: filePath,
            id,
            raw: line,
            chn: ChWordInfo[0],
            lineNum: i, // 索引
            startAt: ChWordInfo.index,
            length: ChWordInfo[0].length
          })
        }
      }
    }
  }
}

const projects = fs.readdirSync(entryPath)
for (const project of projects) {
  const map = []
  const row = []
  const curProject = entryPath + project
  checked(curProject, map, row)
  fs.writeFileSync(path.join(distMapPath, `${project}.map.json`), JSON.stringify(map), {
    encoding: 'utf-8',
    flag: 'w'
  })
  fs.writeFileSync(path.join(distRowPath, `${project}.dic.json`), JSON.stringify(row), {
    encoding: 'utf-8',
    flag: 'w'
  })
}