const HelloCompilationPlugin = require('./plugins/HelloCompilationPlugin.js');

module.exports = {
  mode: 'development',
  plugins: [new HelloCompilationPlugin({})],
};
