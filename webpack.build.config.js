var path = require('path')
var webpack = require('webpack')
require("babel-polyfill");
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var d = new Date();
var dHash = d.getFullYear() + '' + (d.getMonth() + 1) + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2);
console.log(dHash);
const otherCSS = new ExtractTextPlugin('css/style.css?[contenthash]');
const criticalCSS = new ExtractTextPlugin('css/critical.css');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var htmlWebpackMinifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  preserveLineBreaks: true,
  keepClosingSlash: true
};
console.log('webpack.config.js');

function pPath(inp) {
  // console.log('pPath');
  // console.log(inp);
  return inp.replace('_src/', '');
}
module.exports = {
  entry: ['babel-polyfill', './_src/main.js'],
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
    filename: 'js/[name].js?[chunkhash]'
  },
  module: {
    rules: [{
      test: /\.less$/,
      include: /critical/,
      use: criticalCSS.extract(["css-loader", "less-loader"])
    }, {
      test: /\.less$/,
      include: /css/,
      use: otherCSS.extract(["css-loader", "less-loader"])
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 1000,
        name: 'css/fonts/[name].[ext]'
      }
    }, {
      test: /\.(svg)$/,
      include: /css/,
      loader: 'url-loader',
      options: {
        limit: 1000,
        name: 'css/fonts/[name].[ext]'
      }
    }, {
      test: /\.(png|jpg|gif)$/,
      include: /css/,
      loader: 'url-loader',
      options: {
        limit: 1000,
        outputPath: pPath,
        name: 'css/img/[name].[ext]?[hash:3]'
      }
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        sourceMap: true,
        extractCSS: true,
        loaders: {
          css: otherCSS.extract(["css-loader"]),
          less: otherCSS.extract(["css-loader", "less-loader"])
        }
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      exclude: /css/,
      loader: 'url-loader',
      options: {
        limit: 1000,
        outputPath: pPath,
        name: '[path][name].[ext]?[hash:3]'
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
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  plugins: [
    otherCSS,
    criticalCSS,
    new OptimizeCSSPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }), new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, './node_modules')) === 0)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './_src/template/index.ejs'),
      inject: false,
      minify: htmlWebpackMinifyOptions,
      chunksSortMode: 'dependency'
    }),
  ],
  devtool: 'source-map'
}
