const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'main.min': './_js/main.js',
  },
  output: {
    path: __dirname + '/js',
    filename: '[name].js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
