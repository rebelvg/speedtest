const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { parsed } = require('dotenv').config({
  path: [path.resolve('../app/.env'), path.resolve('../app/.env.example')],
  override: false,
});

module.exports = {
  mode: 'development',
  entry: ['./index.tsx'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Speedtest',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...parsed,
      }),
    }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
};
