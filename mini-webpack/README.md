# Mini Webpack

- 读取文件：使用 fs，encoding 为 utf-8
- @babel/parser：将代码解析为 AST
- @babel/traverse：遍历 AST 树，在遍历到 import 的时候把对应的依赖加入到 dependencies 数组中
- babel-core：将 ESM 语法转换为 CJS 语法
- 依赖图通过对 dependencies 数组进行 BFS 得到
- 基于 EJS 模板引擎生成代码
- 命名路径不统一问题：给每个模块一个 id，通过 id 索引模块
