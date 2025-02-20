const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    bundle: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          filename: "imgs/[name]_[hash:8][ext]",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", //  模板名称
      template: "./src/index.html", // 模板路径
    }),

    new HtmlWebpackPlugin({
      filename: "login.html",
      template: "./src/login.html",
    }),

    new HtmlWebpackPlugin({
      filename: "reg.html",
      template: "./src/reg.html",
    }),
    new HtmlWebpackPlugin({
      filename: "forget.html",
      template: "./src/forget.html",
    }),

    // ProvidePlugin 作用 是自动加载模块，而不必到处 import 或 require
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
