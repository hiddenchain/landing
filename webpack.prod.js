const path = require('path')
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
   entry: './src/assets/js/main.js',
   mode: 'production',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ['env']
            }
         },
         {
            test: /\.scss$/,
            use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
         },
         {
            test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            use: [{
               loader: 'file-loader',
               options: {
                  name: '[name].[ext]',
                  outputPath: '.',    // where the fonts will go
                  publicPath: '../'       // override the default path
               }
            }]
         },
      ]
   },
   plugins: [
      new CleanWebpackPlugin(['dist']),
      new CopyWebpackPlugin([
         { from: './src/index.html',    to: "index.html" },
         { from: './src/images/',       to: "images" }
      ]),
      new ImageminPlugin({
         test: 'images/*',
         cacheFolder: path.resolve(__dirname, 'cache/images'),
         plugins: [
            imageminMozjpeg({
               quality: 60,
               progressive: true
            })
         ]
      }),
      new webpack.ProvidePlugin({
         '$': "jquery",
         'jQuery': "jquery"
      }),
      new MiniCssExtractPlugin({
         // Options similar to the same options in webpackOptions.output
         // both options are optional
         filename: "[name].css",
         chunkFilename: "[id].css"
      }),
      new CompressionWebpackPlugin({
         cache: 'cache/compression',
         filename: '[path].gz[query]',
         algorithm: 'gzip',
         test: new RegExp('\\.(js|css)$'),
         threshold: 10240,
         minRatio: 0.8
      }),
      new BundleAnalyzerPlugin()
   ],
   optimization: {
      splitChunks: {
         chunks: "all",
         cacheGroups: {
            node_vendors: {
               priority: 30,
               test: /[\\/]node_modules[\\/]/,
               name: 'node_modules',
            }
         }
      }
   }
}
