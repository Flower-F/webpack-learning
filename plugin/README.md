# 手写 Plugin

- Plugin 一般是一个类，这个类里面需要实现一个 apply 方法，这个方法包含一个 complier 作为参数，这个 complier 是 webpack 实例。
- Plugin 的核心在于，apply 方法执行的时候，可以操作 Webpack 打包的各个时间节点（hooks  生命周期钩子），在不同时间点做一些操作
