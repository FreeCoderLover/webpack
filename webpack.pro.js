'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

module.exports = {
  // entry: './src/js/index.js',
  entry: {
    index: './src/js/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  watch: false, // 默认false不开启
  watchOptions: {
    // 默认空，不监听的文件或文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化，是通过不停询问系统指定文件有没有变化实现的，轮询的时间间隔
    poll: 1000
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              // 样式插入到head标签
              insertAt: 'top',
              // 将所有的style标签合成一个
              singleton: true
            }
          },
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            // css补齐前缀
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          },
          {
            // px转为rem
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecesion: 8
            }
          }
        ]
      },
      {
        test: /.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 将css提取成独立的文件使用link引入插入页面中，只用在production配置中，因为该插件暂时不支持HMR
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    // 压缩css文件
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    // 将css的chunk文件，以内联即style的形式添加到html
    new HTMLInlineCSSWebpackPlugin(),
    // 生成创建html入口文件，引入的外部资源如script、link
    new HtmlWebpackPlugin({
      // html模版所在位置
      template: path.join(__dirname, 'src/index.html'),
      // 打包出的html文件名称
      filename: 'index.html',
      // 将生成的js、css的chunks文件添加到html页面中，主要应用于多入口文件，可以指定当前html插入的指定chunk文件，entry设置对象形式
      // entry设置单个文件，不设置chunks，则生成main文件插入到html页面中
      chunks: ['index'],
      // 对html文件进行压缩，默认为false不对html文件进行压缩，以下设置为具体的压缩选项
      minify: {
        html5: true,
        // 是否去除空格，默认false
        collapseWhitespace: false,
        preserveLineBreaks: false,
        // 压缩内联css
        minifyCSS: true,
        // 压缩内联js
        minifyJS: true,
        // 压缩后是否显示页面的注释信息
        removeComments: true,
      },
      // 注入选项，默认true，true和body，javascirpt插入到html文件的body底部，head则插入到head标签的底部，false所有的资源都不被插入
      inject: true,
      // 给生成的文件配置hash值
      hash: true,
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
}
