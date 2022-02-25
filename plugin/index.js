class DemoWebpackPlugin {
  constructor() {
    console.log('plugin init');
  }
  // compiler是webpack实例
  apply(compiler) {
    // compilation代表每一次执行打包，独立的编译
    compiler.hooks.compile.tap('DemoWebpackPlugin', (compilation) => {
      console.log(compilation);
    });
  }
}

module.exports = DemoWebpackPlugin;
