const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // ✅ BERUBAH

module.exports = merge(common, {
  mode: 'production',

  module: {
    rules: [
      /* =============================
         CSS EXTRACT
         ============================= */
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },

      /* =============================
         JS TRANSPILE
         ============================= */
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  plugins: [
    /* =============================
       CLEAN DIST BEFORE BUILD
       ============================= */
    new CleanWebpackPlugin(),

    /* =============================
       EXTRACT CSS
       ============================= */
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    /* =============================
       ✅ SERVICE WORKER (MANUAL MODE)
       Copy sw.js ke dist TANPA InjectManifest
       ============================= */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/scripts/sw.js'),
          to: 'sw.js',
        },
      ],
    }),
  ],
});
