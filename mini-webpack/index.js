// 目标：获取文件内容 + 获取文件依赖
import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import ejs from 'ejs';
import { transformFromAst } from 'babel-core';

let id = 0;

function createAsset(filePath) {
  // 1.获取文件内容
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  // 2.获取依赖关系
  // 获取 AST 的根节点
  const ast = parser.parse(source, {
    sourceType: 'module',
  });

  const dependencies = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      // 当访问到这种类型的节点的时候会自动调用这个函数
      dependencies.push(node.source.value); // 获取依赖关系
    },
  });

  // 将 ESM 语法转换为 CJS 语法
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });
  // console.log(code);

  return {
    filePath,
    code,
    dependencies,
    mapping: {},
    id: id++,
  };
}

// const asset = createAsset();
// console.log(asset);

// 创建图
// 为什么是图不是树，因为有可能会存在 a 依赖于 b，b 也依赖于 a 的情况
function createGraph() {
  // 入口文件
  const mainAsset = createAsset('./example/main.js');

  // bfs 遍历图
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.dependencies.forEach((relativePath) => {
      const child = createAsset(path.resolve('./example', relativePath));
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }

  return queue;
}

const graph = createGraph();

function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', {
    encoding: 'utf-8',
  });

  const data = graph.map((asset) => {
    const { id, code, mapping } = asset;

    return {
      // filePath: asset.filePath,
      id,
      code,
      mapping,
    };
  });
  // console.log(data);

  // 根据模板生成代码
  const code = ejs.render(template, { data });
  // 写入文件
  fs.writeFileSync('./dist/bundle.js', code);
}

build(graph);
