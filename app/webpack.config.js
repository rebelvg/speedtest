const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./config');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${config.app.host}:${config.app.port}`,
    'webpack/hot/only-dev-server',
    './index.tsx',
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    hot: true,
    host: config.app.host,
    historyApiFallback: true,
    publicPath: '/',
    port: config.app.port,
    proxy: [
      {
        path: '/api',
        target: `http://${config.api.host}:${config.api.port}`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      app: path.resolve(__dirname, './'),
    },
  },
  node: {
    fs: 'empty',
  },
  output: {
    filename: 'dev_bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
  },
};
