const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

console.log(path.resolve('../app/.env'));

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
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
    new HtmlWebpackPlugin({
      title: 'Speedtest',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
      systemvars: true,
      path: path.resolve('../app/.env'),
    }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      app: path.resolve(__dirname, './'),
    },
  },
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    publicPath: '/',
  },
};
