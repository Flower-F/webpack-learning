---
title: webpack 基础学习笔记
date: 2022-01-24 11:33:05
tags: [webpack, 连载]
copyright: true
---
# webpack 初体验

运行命令初始化 package.json。

```bash
npm init -y
```

安装 webpack 和 webpack-cli。

```bash
yarn add webpack webpack-cli -D
```

根目录新建文件夹 src，里面新建文件夹 js。

js 文件夹下新建两个文件 math.js 和 foo.js。内容如下：

```js
// math.js
export const sum = (a, b) => {
  return a + b;
};

export const mul = (a, b) => {
  return a * b;
};
```

```js
// foo.js
function foo() {
  console.log("foo");
}

module.exports = {
  foo,
};
```

src 目录下新建文件 index.js，文件内容如下：

```js
import { sum, mul } from "./js/math";
const { foo } = require("./js/foo");

console.log(sum(2, 3));
console.log(mul(2, 3));

foo();
```

根目录下新建 index.html，内容如下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webpack Learning</title>
</head>

<body>
  <script src="./dist/main.js"></script>
</body>

</html>
```

运行命令打包文件。

```bash
npx webpack
```

在 dist/main.js 中，可以看到打包的结果。

在 package.json 中配置 build 运行命令。

```json
"build": "npx webpack"
```

# css-loader & style-loader

src/js 目录下新建文件 title.js，内容如下：

```js
import "../css/title.css";

function setTitle(title) {
  const h1 = document.createElement("h1");
  h1.innerHTML = title;
  h1.className = "title";
  document.body.appendChild(h1);
}

export default setTitle;
```

修改 index.js 内容为：

```js
import setTitle from "./js/title";

setTitle("hello world");
```

src 目录下新建文件夹 css，css 文件夹下新建文件 title.css，内容如下：

```css
.title {
  color: red;
}
```

在 index.html 中引入 css 文件。

运行命令 `yarn build`，报错，原因是缺少 loader。

安装 loader。

```
yarn add css-loader -D
```

根目录下新建文件 webpack.config.js，进行配置。

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
};
```

但是样式并没有展示，因为现在只是把 css 语法识别为了 js 语法，但是还没有挂载到页面上，我们需要 style-loader 来把内容挂载到 `<style>` 标签上。

安装 style-loader

```
yarn add style-loader -D
```

修改配置文件：

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

# less-loader

首先安装 less。

```bash
yarn add less -D
```

配置文件修改为下面的内容。

安装 less-loader。

```bash
yarn add less-loader -D
```

```js
rules: [
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
  },
  {
    test: /\.less$/,
    use: ["style-loader", "css-loader", "less-loader"],
  },
],
```

# browserslitrc

浏览器使用比例可以查看 [caniuse 官网](https://caniuse.com/)

在 package.json 中新增内容

```json
"browserslist": [
  ">1%",
  "last 2 version",
  "not dead"
]
```

运行命令
```
npx browserslist
```

可查看当前兼容的浏览器选项。

# postcss-loader

postcss 用来处理 css 的兼容性问题。

先安装 postcss 和 postcss-loader

```bash
yarn add postcss -D
```

css 文件夹下新建文件 test.css，内容如下：

```css
.title {
  user-select: none;
  transition: all 1s;
}
```

然后把文件引入 title.js 中。

修改 webpack.config.js 为：

```js
{
  test: /\.css$/,
  use: ["style-loader", "css-loader", "postcss-loader"],
},
{
  test: /\.less$/,
  use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
},
```

打包以后发现没有任何效果，原因是 postcss 本身其实不具备修改 css 的功能，还需要额外的插件才行。

## autoprefixer

安装插件 autoprefixer。

```bash
yarn add autoprefixer -D
```

修改配置文件为：

```js
{
  test: /\.css$/,
  use: [
    "style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("autoprefixer")],
        },
      },
    },
  ],
},
```

## postcss-preset-env

安装 postcss-preset-env。

```bash
yarn add postcss-preset-env -D
```

修改 test.css 内容为：

```css
.title {
  color: #12345678;
}
```

postcss-loader 配置的 plugins 中增加以下内容

```js
require("postcss-preset-env")
```

打包以后颜色会以 rgba 形式展示。

## 避免重复配置

为了避免在 css-loader 和 less-loader 中都要进行重复的配置，postcss 还支持我们通过配置文件进行配置。

根目录下新建文件 postcss.config.js，内容为：

```js
module.exports = {
  plugins: [require("autoprefixer"), require("postcss-preset-env")],
};
```

这样我们就不需要在 webpack.config.js 中书写 postcss-loader 的 plugins 了。

```js
{
  test: /\.css$/,
  use: ["style-loader", "css-loader", "postcss-loader"],
},
{
  test: /\.less$/,
  use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
},
```

# filer-loader

## 处理 img 标签

在 src 文件夹下新建文件夹 img，里面塞入一张图片。

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/123112132122.jpg)

在 js 文件夹下新建文件 image.js，内容如下：

```js
import imgSrc from "../img/ai.jpg";

function setImage() {
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.src = imgSrc;
  div.appendChild(img);
  document.body.appendChild(div);
}

export default setImage;
```

修改 index.js，内容如下：

```js
import setImage from "./js/image";

setImage();
```

打包以后报错缺少 loader。

安装 file-loader。

```bash
yarn add file-loader -D
```

修改 webpack.config.js，添加如下内容

```js
{
  test: /\.(png|svg|gif|jpe?g)$/,
  use: ["file-loader"],
},
```

## 处理 css 背景图片

修改 js/image.js 为以下内容：

```js
import "../css/bg.css";

function setImage() {
  const div = document.createElement("div");
  const backgroundImg = document.createElement("div");
  backgroundImg.className = "bg-img";
  div.appendChild(backgroundImg);
  document.body.appendChild(div);
}

export default setImage;
```

css 文件夹下新建文件 bg.css，内容如下：

```css
.bg-img {
  background-image: url(../img/ai.jpg);
  border: 1px solid black;
  width: 400px;
  height: 400px;
}
```

先删除 dist 目录，再运行打包命令。此时发现 dist 目录下会出现两张图片。

其中一张是正常的，另一张点击打开以后内容如下：

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/20220124143938.png)

里面的文本内容是一个指向我们需要的图片的导出语句。

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/20220124144219.png)

这是因为图片是嵌在 css-loader 里面，没有被 file-loader 处理。

css-loader 会把 url 路径处理为 require 语句，而 require 语句使用时需要把 css-loader 的 esModule 属性设置为 false。

```js
{
  test: /\.css$/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        esModule: false,
      },
    },
    "postcss-loader",
  ],
},
```

处理以后打包问题就解决了。

# 图片名称和路径设置

- [ext] 拓展名
- [name] 文件名
- [hash] 哈希
- [hash:<length>] 哈希截取长度
- [path] 文件路径

修改 webpack.config.js 如下

```js
{
  test: /\.(png|svg|gif|jpe?g)$/,
  use: [
    {
      loader: "file-loader",
      options: {
        name: "[name].[hash:6].[ext]",
        outputPath: "img",
      },
    },
  ],
},
```

# url-loader

安装 url-loader。

```bash
yarn add url-loader -D
```

把配置文件的 file-loader 修改为 url-loader，进行打包。

打包后发现页面显示正常，但是 dist 目录下没有出现 img 文件夹。

它会以 base64 形式把图片嵌入代码中。

# limit

**url-loader VS file-loader**

- url-loader 会把文件转换为 base64 格式，可以减少请求次数，但是会增加单次请求文件的体积，不利于首屏渲染
- file-loader 会将资源拷贝到指定目录，分开请求
- url-loader 可以调用 file-loader，通过设置 limit 进行阈值限制，控制文件小于多少的时候使用 url-loader

在 img 文件夹下加入一张新图片

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/ai2.jpg)

修改 image.js 如下：

```js
import "../css/bg.css";
import imgSrc from "../img/ai2.jpg";

function setImage() {
  const div = document.createElement("div");

  const img = document.createElement("img");
  img.src = imgSrc;
  div.appendChild(img);

  const backgroundImg = document.createElement("div");
  backgroundImg.className = "bg-img";
  div.appendChild(backgroundImg);

  document.body.appendChild(div);
}

export default setImage;
```

修改 webpack.config.js 文件如下：

```js
{
  test: /\.(png|svg|gif|jpe?g)$/,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "[name].[hash:6].[ext]",
        outputPath: "img",
        limit: 25 * 1024, // 即 25Kb
      },
    },
  ],
},
```

运行打包命令，会发现只有一张较大的图片，另一张小的图片被以 base64 的形式嵌入文件里了。

# asset 处理图片

webpack5 之后不需要再使用 file-loader 和 url-loader 了。

- asset/resource => file-loader
- asset/inline => url-loader
- asset => 阈值限制

修改 webpack.config.js 如下：

```js
{
  test: /\.(png|svg|gif|jpe?g)$/,
  type: "asset/resource",
  generator: {
    filename: "img/[name].[hash:6][ext]",
  },
},
```

如果需要设置 limit，则修改如下：

```js
{
  test: /\.(png|svg|gif|jpe?g)$/,
  type: "asset",
  generator: {
    filename: "img/[name].[hash:6][ext]",
  },
  parser: {
    dataUrlCondition: {
      maxSize: 25 * 1024,
    },
  },
},
```

# asset 处理字体图标

先去 [iconfont 官网](https://www.iconfont.cn/)下载图标。

在 src 下新建文件夹 font，里面留着下面图片中这几个文件即可。

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/20220124155141.png)


src/js 下新建文件 font.js，内容如下：

```js
function setFont() {
  const div = document.createElement("div");

  const span = document.createElement("span");
  span.className = "iconfont icon-gift lg-icon";
  div.appendChild(span);

  document.body.appendChild(div);
}

export default setFont;
```

修改 index.js 内容如下：

```js
import setFont from "./js/font";

setFont();
```

运行打包命令，报错，这是因为我们没有办法处理 iconfont 里面的路径。

我们直接把字体当成资源文件进行拷贝即可，因此可以使用前面所说的 asset/resource ，给 webpack.config.js 添加如下内容即可：

```js
{
  test: /\.(ttf|woff2?)$/,
  type: "asset/resource",
  generator: {
    filename: "font/[name].[hash:6][ext]",
  },
},
```

# plugin VS loader

- loader：webpack 只认识 js 和 json 文件，为了让 webpack 认识其它文件，如 css、jpg、png 等等，需要将其它类型文件**转换**为 js 格式，让 webpack 认识，这个转换的作用就是 loader 提供的。
- plugin：plugin 可以做更多的事情，比如在打包开始之前做一些预处理，或者打包进行过程中做一些处理。loader 的作用时机只有当 webpack 要读取某个文件的时候，但是 plugin 的作用时机很多。

# clean-webpack-plugin

安装 clean-webpack-plugin

```bash
yarn add clean-webpack-plugin -D
```

作用是每次打包之前先把 dist 目录删除。

修改 webpack.config.js 内容：

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/20220124162444.png)

在现版本的 webpack 中，已经不需要再加入此插件了，直接设置 output 的 clean 属性为 true 即可。

# html-webpack-plugin

安装 html-webpack-plugin

```bash
yarn add html-webpack-plugin -D
```

引入 HtmlWebpackPlugin 类

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
```

引入插件：

```js
new HtmlWebpackPlugin({
  title: "Webpack Learning",
}),
```

这里打包以后产出的 js 文件是 defer 引入的。但是这样很不灵活，其实我们可以自己书写打印出的模板。

在 src 目录下新建文件夹 public。public 下新建文件 index.html。我们把 vue-cli 的 index.html 拷贝过来。

```html
<!DOCTYPE html>
<html lang="">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="<%= BASE_URL %>favicon.ico">
  <title>
    <%= htmlWebpackPlugin.options.title %>
  </title>
</head>

<body>
  <noscript>
    <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
        Please enable it to continue.</strong>
  </noscript>
  <div id="app"></div>
  <!-- built files will be auto injected -->
</body>

</html>
```

打包以后报错说找不到 BASE_URL。webpack 可以自定义一些常量，我们在这还没有定义所以会报错。这里用到的是 webpack 内置的一个插件。

```js
const { DefinePlugin } = require("webpack");

new DefinePlugin({
  BASE_URL: '"./"', // 必须包裹两层引号，否则会在转译的时候以 const a = ./ 的形式出现，导致出错
}),
```

# babel

Babel 的作用：JSX TS ES6+ => 转换为浏览器可以直接使用的语法

将 js/foo.js 内容修改如下：

```js
const foo = () => {
  console.log("hello babel");
};

export default foo;
```

修改 index.js 如下：

```js
import foo from "./js/foo";

foo();
```

打包后，main.js 内容含有箭头函数，可能在某些浏览器无法正常显示。我们需要使用 babel 处理。

# babel-loader

安装 @babel/core（核心模块）

```bash
yarn add @babel/core -D
```

安装 babel-loader

```bash
yarn add babel-loader -D
```

安装插件 @babel/preset-env -D

```bash
yarn add @babel/preset-env -D
```

修改配置文件如下：

```js
{
  test: /\.js$/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  ],
},
```

然后就可以把语法转成 ES5 了。

还可以新建文件 babel.config.js，里面写入一下配置内容：

```js
module.exports = {
  presets: ["@babel/preset-env"],
};
```

然后就能简写 webpack.config.js 的信息为：

```js
{
  test: /\.js$/,
  use: ["babel-loader"],
},
```

# polyfill

preset-env 并不能把所有的语法都转换，此时我们需要 polyfill。polyfill 即字面意思，填充，意思是填充一些旧版本没有的新语法（比如 Promise）。webpack4 会默认加入 polyfill，所以打包速度很不乐观，在 webpack5 就去掉了。

修改 index.js 内容为：

```js
const p1 = new Promise((resolve, reject) => {
  console.log("promsie");
  resolve();
});
```

安装 core-js、regenerator-runtime，注意此处不是开发依赖。

```bash
yarn add core-js regenerator-runtime
```

然后修改 babel.config.js，内容如下：

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
};
```

在 index.js 中引入核心模块。

```js
import "core-js/stable";
import "regenerator-runtime/runtime";

const p1 = new Promise((resolve, reject) => {
  console.log("promsie");
  resolve();
});
```

# copy-webpack-plugin

可以进行一些资源的拷贝，如 favicon 图标。

安装 copy-webpack-plugin。

```bash
yarn add copy-webpack-plugin -D
```

引入插件：

```js
const CopyWebpackPlugin = require("copy-webpack-plugin");
```

修改 webpack.config.js：

```js
new CopyWebpackPlugin({
  patterns: [
    {
      from: "public",
      globOptions: {
        ignore: ["**/index.html"],
      },
    },
  ],
}),
```

修改 index.js 内容：
```js
import "./js/font";
import "./js/image";
```

# webpack-dev-server

在 webpack.config.js 中添加 watch: true，如下所示。

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/20220124182901.png)

当文件修改以后，会自动触发打包。但是这样会影响速度，因为每次保存都要重新打包一次。我们可以在本地开启一个服务器，把文件存储在内存中。

安装 webpack-dev-server。

```bash
yarn add webpack-dev-server -D
```

在 package.json 中配置命令：

```bash
"start": "npx webpack serve"
```

运行命令

```
yarn start
```

这样就可以实现开启本地服务器。

# HMR

HMR 即 hot-module-replacement，模块热替换，也叫热更新，就是可以对页面的局部内容进行替换。

首先修改 index.js 内容为

```js
console.log("HMR");
```

修改 public 文件夹下的 index.html，增加一个输入框，用于验证热替换是否开启。

```html
<body>
  <noscript>
    <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
        Please enable it to continue.</strong>
  </noscript>
  <div id="app">
    <input type="text">
  </div>
  <!-- built files will be auto injected -->
</body>
```

webpack.config.js 中加入内容：

```js
devServer: {
  hot: true,
  port: 3000，
},
```

此时事实上还没有开启热更新。还需要把热更新的选项加入配置中。因为开发中通常是使用框架进行，所以这部分意义不大，省略。

# React HMR

安装 @babel/preset-react，这是一个用于转换 jsx 语法的插件。

```bash
yarn add @babel/preset-react -D
```

安装 react。

```bash
yarn add react react-dom
```

src 目录下新建文件 App.jsx，内容如下：

```jsx
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [title, setTitle] = useState("Hello World");
  return <h1 className="title">{title}</h1>;
};

export default App;
```

修改 index.js，内容如下：

```js
import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("app"));
```

修改 babel.config.js，内容如下：

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    ["@babel/preset-react"],
  ],
};
```

此时可以支持 React 语法，为了实现热更新，还需要引入其它插件。

安装 @pmmmwh/react-refresh-webpack-plugin 和 react-refresh

```bash
yarn add @pmmmwh/react-refresh-webpack-plugin react-refresh -D
```

在 webpack.config.js 中引入插件：

```js
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
```

```js
new ReactRefreshWebpackPlugin(),
```

修改 babel.config.js，内容如下：

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    ["@babel/preset-react"],
  ],
  plugins: [["react-refresh/babel"]],
};
```

此时就能实现 React 的热更新了。

# devServer 其它属性设置

```js
devServer: {
  hot: true,
  port: 3000,
  compress: true,
  open: true,
  historyApiFallback: true,
},
```

compress 表示是否压缩资源（使用 gzip），open 表示是否自动打开文件，当使用 History API 时，任意的 404 响应会被替代为 index.html。

**hot: 'only'** 和 **hot: true** 的区别：
如果文件报错了，修改成了对的以后，hot: true 会直接刷新整个页面，而 hot: 'only' 不会刷新整个页面。

# proxy

先开启一个 node 服务。

```js
// 服务端 http://127.0.0.1:8000
const http = require("http");

const port = 8000;

http
  .createServer((req, res) => {
    res.end(JSON.stringify("hello world"));
  })
  .listen(port, function () {
    console.log("server is listening on port " + port);
  });
```

安装 axios

```bash
yarn add axios
```

修改 index.js 内容为：

```js
import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

axios.get("http://127.0.0.1:8000/").then((res) => {
  console.log(res.data);
});

ReactDOM.render(<App />, document.getElementById("app"));
```

此时请求出现跨域，需要设置代理。

```js
devServer: {
  hot: true,
  port: 3000,
  compress: true,
  open: true,
  proxy: {
    "/api": {
      target: "http://127.0.0.1:8000/",
      // 如果请求路径是 http://127.0.0.1:8000/api/user 这种就不需要重写
      // 如果请求路径是 http://127.0.0.1:8000/user 这种就需要重写
      pathRewrite: { "^api": "" },
    },
  },
},
```

前端更改为：

```js
axios.get("http://127.0.0.1:8000/").then((res) => {
  console.log(res.data);
});
```

此时跨域问题得到解决。

# source-map

devtool 选项控制是否需要 source-map。

source-map 是一种映射方式，可以在调试的时候定位到源代码中的位置。

设置 `devtool: 'source-map'`，运行 `yarn build`，dist 目录下除了原来的文件外还会多出一个 main.js.map，然后也可以定位到错误的具体位置了。

# devtool

通过 devtool 还可以进行更多的配置。

- source-map：错误信息有行也有列，推荐使用
- inline-source-map：直接把 map 信息塞入 main.js 中，可以减少一次请求
- cheap-source-map：错误信息只显示行，不显示列

# ts-loader 编译 ts

src 目录下新建文件 index.ts，内容如下：

```ts
const add = (a: number, b: number) => {
  return a + b;
};

console.log(add(1, 3));
```

修改 webpack.config.js 文件中的 entry 为 "./src/index.ts"

执行命令 

```
tsc --init
```

生成 tsconfig.json 文件。

安装 ts-loader。

```
yarn add ts-loader -D
```

安装 typescript。

```
yarn add typescript -D
```

修改 webpack.config.js 文件内容：

```js
{
  test: /\.ts$/,
  use: ["ts-loader"],
},
```

# babel-loader 编译 ts

此时 ts 已经可以被正确编译，但是一些新的语法没有被转换为低级的语法，可能会存在兼容性问题，所以还需要 babel-loader 进行进一步的处理。

安装 @babel/preset-typescript

```bash
yarn add @babel/preset-typescript -D
```

修改 babel.config.js，内容为：

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"],
  ],
  plugins: [["react-refresh/babel"]],
};
```

ts-loader 如果出现数据类型错误，会在 build 的时候暴露；而 babel-loader 可以进行 polyfill。

我们可以选择使用 babel-loader，然后通过命令进行类型校验。输入命令 `tsc`，可以实现数据类型的校验。

也可以选择直接修改打包命令如下：

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/20220125001809.png)

# 分离生产和开发环境

修改 package.json 中的脚本命令：

![](https://cdn.jsdelivr.net/gh/Flower-F/picture@main/img/20220125150959.png)

在根目录下新建文件夹 config，然后在 config 文件夹下新建 3 个文件 webpack.common.js、webpack.dev.js、webpack.prod.js。

安装 webpack-merge，来进行文件合并。

```bash
yarn add webpack-merge -D
```

文件内容如下：

```js
// webpack.common.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.ts$/,
        use: ["babel-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        type: "asset",
        generator: {
          filename: "img/[name].[hash:6][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 25 * 1024,
          },
        },
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "font/[name].[hash:6][ext]",
        },
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.jsx$/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack Learning",
      template: "./public/index.html",
    }),
    new DefinePlugin({
      BASE_URL: '"./"',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
};
```

```js
// webpack.dev.js
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    hot: true,
    port: 3000,
    compress: true,
    open: true,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
```

```js
// webpack.prod.js
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../dist"),
    clean: true,
  },
});
```

修改 babel.config.js，区分生产和开发环境：

```js
const isDev = process.env.NODE_ENV !== "production";

const config = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"],
  ],
};

if (isDev) {
  config.plugins = [["react-refresh/babel"]];
}

module.exports = config;
```