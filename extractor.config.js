// https://github.com/isaacs/node-glob#readme 
// include前面会自动加上当前项目的路径,所以/指向的是当前项目
module.exports = {
  include: ['/**/*.js{,x}', '/**/*.ts{,x}'], // 只能写文件
  exclude: ['**/*[Dd]emo*']
}