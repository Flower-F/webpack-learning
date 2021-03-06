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
