class HelloCompilationPlugin {
  apply(compiler) {
    // 指定一个挂载到 compilation 的钩子，回调函数的参数为 compilation 。
    compiler.hooks.compilation.tap('HelloCompilationPlugin', (compilation) => {
      // 现在可以通过 compilation 对象绑定各种钩子
      console.log('现在可以通过 compilation 对象绑定各种钩子');
      compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
        console.log('资源已经优化完毕。');
      });
    });
  }
}

module.exports = HelloCompilationPlugin;
