const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${config.app.host}:${config.app.port}`,
    'webpack/hot/only-dev-server',
    'app/index.js',
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: [
          path.resolve(__dirname, 'app'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['env', {
              'targets': {
                'browsers': ['last 2 Chrome versions']
              }
            }], 'react', 'stage-0'],
            plugins: [
              'transform-class-properties',
              'react-html-attrs',
              'transform-decorators-legacy',
              'transform-async-to-generator'
            ],
          }
        },
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
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
        target: `http://${config.api.host}:${config.api.port}/api`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    ]
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, './app'),
    }
  },
  node: {
    fs: 'empty'
  },
  output: {
    filename: 'dev_bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  }
}
