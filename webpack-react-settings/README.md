---
title: 使用 Webpack 从零打造 React 开发环境
date: 2022-01-24 10:29:48
tags: [webpack, react]
copyright: true
---
# 初始化

先初始化项目

```bash
yarn init -y
```

运行命令初始化 package.json 文件。

安装 webpack 和 webpack-cli。

```bash
yarn add webpack webpack-cli -D
```

# 进行 ts 配置

```bash
tsc --init
```

修改 tsconfig.json，使用 create-react-app 的设置：

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "baseUrl": "./src",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```

在根目录下新建文件夹 config，书写配置信息。

```js
// config/webpack.common.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
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
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.tsx?$/i,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/i,
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
        test: /\.(ttf|woff2?)$/i,
        type: "asset/resource",
        generator: {
          filename: "font/[name].[hash:6][ext]",
        },
      },
      {
        test: /\.jsx?$/i,
        use: ["babel-loader"],
        exclude: /node_modules/
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
// config/webpack.dev.js
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
// config/webpack.prod.js
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

# 安装 react

```bash
yarn add react react-dom
```

安装 ts 依赖

```bash
yarn add @types/react @types/react-dom -D
```

# 安装 babel 相关依赖

```bash
yarn add babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/preset-react @babel/preset-typescript -D
```

根目录新建文件 babel.config.js，内容如下：

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

# 安装 loader

```bash
yarn add sass-loader css-loader postcss-loader postcss style-loader babel-loader -D
```

# 安装 plugin

```bash
yarn add @pmmmwh/react-refresh-webpack-plugin react-refresh copy-webpack-plugin html-webpack-plugin -D 
```

# 安装 postcss 依赖

```bash
yarn add postcss-preset-env autoprefixer -D
```

新建文件 postcss.config.js：

```js
module.exports = {
  plugins: [require("autoprefixer"), require("postcss-preset-env")],
};
```

# 添加 browserslist

给 package.json 添加 browserslist。

```json
"browserslist": [
  ">1%",
  "last 2 version",
  "not dead"
]
```

# 安装 webpack-dev-server

```bash
yarn add webpack-dev-server -D
```

# 安装 webpack-merge

```bash
yarn add webpack-merge -D
```

# 配置脚本命令

```json
"scripts": {
  "build": "cross-env NODE_ENV=production npx webpack --config ./config/webpack.prod.js",
  "start": "tsc --noEmit && cross-env NODE_ENV=development npx webpack serve --config ./config/webpack.dev.js"
}
```
