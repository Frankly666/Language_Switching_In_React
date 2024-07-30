const _ = {
  cancelText: "最普通的情况",
  report: false
    ? String("出现在方法调用的地方，出现在方法调用的地方，出现在方法调用")
    : `${Math.random()} 一次性出现多行的 ${Math.random()} 情况 ${new Date()}`,
};

/** 注释中文 */

/**
 * 注释中文
 * 注释第二行
 */

const __ = ["一", "二", "三", "四", "五", "六", "日"].map((x) => `周${x}`);
// 注释中文
function A() {
  return (
    <div>
      <div>tsx 测试</div>
      <div>{"tsx 测试"}</div>
      <p>
        你也不知道这个出现在哪里，这是一个单行字符串；你也不知道这个出现在哪里，这是一个单行字符串；
      </p>
      {/* 注释中文 */}
    </div>
  );
}
