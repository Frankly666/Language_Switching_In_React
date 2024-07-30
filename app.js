const fs = require('fs')
const path = require('path')
const hanRegex = /[，。？《》「」【】（）、·～！\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}]+/u
const hanRegexG = /[，。？《》「」【】（）、·～！\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}]+/ug
// const hanRegex = /[\u4e00-\u9fa5]+/g
const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\/|^\s*\*.*/;

const archiver = require('archiver')


// 创建打包后的文件
if(fs.existsSync('dist')) fs.rmSync('dist', {recursive: true})
if(fs.existsSync('dist.zip')) fs.rmSync('dist.zip') // 可以不要, 但是加上更好
const distPath = path.resolve('dist')
fs.mkdirSync(distPath)
const distRowPath = path.resolve(distPath, 'row')
fs.mkdirSync(distRowPath)
const distWordPath = path.resolve(distPath, 'word')
fs.mkdirSync(distWordPath)

function checked(dir, dirname) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for(const file of files) {
    const name = file.name
    if(file.isFile() && !name.toLowerCase().includes('demo')) {
      // endsWidth 不能是正则表达式
      if(
        //  name.endsWith('.json') || 
         name.endsWith('.js') || 
         name.endsWith('.ts') || 
         name.endsWith('.tsx') ||
         name.endsWith('.jsx')) {
          const content = fs.readFileSync(path.join(dir, name), 'utf-8').toString()
          const lines = content.split('\n')
          for(let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const str = line.replace(commentRegex, '');
            if(hanRegex.test(str)) {
              const ChWords = hanRegexG[Symbol.match](line)
              // console.log(ChWords);
              for(const ChWord of ChWords) {
                fs.writeFileSync(path.join(distRowPath, `${dirname}.row.txt`), line , {
                  encoding: 'utf-8',
                  flag: 'a'
                })
                fs.writeFileSync(path.join(distWordPath, `${dirname}.word.txt`), ChWord + '\n' , {
                  encoding: 'utf-8',
                  flag: 'a'
                })
              }
            }
          }
      }
    }
    if(file.isDirectory()) checked(path.join(dir, name), dirname)
  }
}
const projects = fs.readdirSync('src')
for(const project of projects) {
  checked(path.join(__dirname, 'src', project), project)
}

const output = fs.createWriteStream(path.resolve('dist.zip'))
const archive = archiver('zip', {zlib: {level: 9}})
archive.pipe(output)
archive.directory('dist/', false)
archive.finalize()