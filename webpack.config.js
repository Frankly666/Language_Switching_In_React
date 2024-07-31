const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  // 解析模块请求的配置
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src/"),
    }
  },
  // 模块加载器配置
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // 使用ts-loader处理TypeScript文件
      },
    ],
  },
  plugins: [],
};
