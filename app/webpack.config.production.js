const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { parsed } = require('dotenv').config({
  path: path.resolve('../app/.env'),
});
const _ = require('lodash');

_.forEach(parsed, (v, k) => {
  parsed[k] = process.env[k];
});

module.exports = {
  mode: 'production',
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
    new CopyWebpackPlugin({
      patterns: ['staticwebapp.config.json'],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...parsed,
      }),
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
  },
};
