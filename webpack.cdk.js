const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: './src/main-lambda-handler.ts',
  output: {
    path: __dirname + '/cdk/dist',
    filename: 'main.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
});
