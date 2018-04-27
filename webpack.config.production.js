const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /.js/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
            plugins: [
              'transform-class-properties',
              'react-html-attrs',
              'transform-decorators-legacy'
            ],
          }
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        include: [
          path.resolve(__dirname, 'static'),
        ],
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        loader: 'file-loader'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  devtool: 'source-map',
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  }
}
