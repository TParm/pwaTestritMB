const path = require("path")
const webpack = require('webpack')
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin")
const WebpackPwaManifest = require('webpack-pwa-manifest')

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
       test: /\.(png|svg|jpg|gif)$/,
       use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'Progressive Web Application',
      template: "./src/html/index.html",
      filename: "./index.html",
      // template: "./src/html/push.html",
      // filename: "./push.html",
      excludeChunks: [ 'server' ]
    }),
    new HtmlWebPackPlugin({
      template: "./src/html/push.html",
      filename: "./push.html",
      excludeChunks: [ 'server' ]
    }),
    new WorkboxPlugin.InjectManifest({
        swSrc: './src/sw.js',
    }),

    new WebpackPwaManifest({
        name: 'My Progressive Web App',
        short_name: 'MyPWA',
        description: 'My awesome Progressive Web App!',
        background_color: '#ffffff',
        crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
        publicPath: './',
        icons: [
          {
            src: path.resolve('./src/img/assets/logo-512.png'),
            sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
          },
          {
            src: path.resolve('./src/img/assets/maskable-1024.png'),
            size: '1024x1024' // you can also use the specifications pattern
          },
          {
            src: path.resolve('./src/img/assets/maskable-1024.png'),
            size: '1024x1024',
            purpose: 'maskable'
          }
        ]
      })    
  ]
}