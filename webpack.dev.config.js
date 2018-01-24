var path = require('path')
var webpack = require('webpack')
require("babel-polyfill");
console.log('webpack.dev.config.js');
module.exports = {
  entry: ['babel-polyfill', './_src/main.js'],
  output: {
    path: path.resolve(__dirname, './'),
    publicPath: '/',
    filename: 'build.js'
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "less-loader"
      }]
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name].[ext]?[hash]'
      }
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {}
        // other vue-loader options go here
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    }]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './_src'),
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "/"),
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      "/apinaja": "http://localhost:3000"
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: []
}
