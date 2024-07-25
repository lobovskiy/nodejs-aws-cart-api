const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
});
