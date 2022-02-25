# 手写 Loader

- 一般使用 loader-utils 来方便 loader 的编写
- Loader 一般是一个函数，它接收参数 source
- Loader 绝对不能使用箭头函数，否则会改变 this 的指向
