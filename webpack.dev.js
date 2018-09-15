const path = require('path')
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   devtool: 'eval-cheap-module-source-map',
   entry: './src/assets/js/main.js',
   devServer: {
      contentBase: path.join(__dirname, "dist")
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
            test: /\.(scss|css)$/,
            use: [
               MiniCssExtractPlugin.loader,
               {
                  // translates CSS into CommonJS
                  loader: "css-loader",
                  options: {
                     sourceMap: true
                  }
               },
               {
                  // compiles Sass to CSS
                  loader: "sass-loader",
                  options: {
                     outputStyle: 'expanded',
                     sourceMap: true,
                     sourceMapContents: true
                  }
               }
            ]
         },
         {
            test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            use: [{
               loader: 'file-loader',
               options: {
                  name: '[name].[ext]',
                  outputPath: '.',    // where the fonts will go
                  publicPath: '../'   // override the default path
               }
            }]
         },
      ]
   },
   plugins: [
      new CopyWebpackPlugin([
         { from: './src/index.html',    to: "index.html" },
         { from: './src/generic.html',  to: "generic.html" },
         { from: './src/elements.html', to: "elements.html" },
         { from: './src/images/',       to: "images" },
         { from: './src/assets/css/',   to: "assets/css" },
         { from: './src/assets/fonts/', to: "assets/fonts" },
      ]),
      new webpack.ProvidePlugin({
         '$': "jquery",
         'jQuery': "jquery"
      }),
      new MiniCssExtractPlugin({
         // Options similar to the same options in webpackOptions.output
         // both options are optional
         filename: "[name].css",
         chunkFilename: "[id].css"
      })
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

