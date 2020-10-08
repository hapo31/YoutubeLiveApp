/* eslint-disable @typescript-eslint/no-var-requires */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");
const isDev = process.env.NODE_ENV !== "production";

/* eslint-enable */

const outputPath = path.resolve(__dirname, "dist");
const tsconfigPath = path.resolve(__dirname, "./tsconfig.json");
const resolveExt = [".json", ".js", ".jsx", ".css", ".ts", ".tsx"];

var main = {
  mode: isDev ? "development" : "production",
  target: "electron-main",
  devtool: isDev ? "source-map" : false,
  entry: path.join(__dirname, "src", "mainprocess", "App"),
  output: {
    filename: "index.js",
    path: outputPath,
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: resolveExt,
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfigPath })],
  },
  plugins: [],
};

var preload = {
  mode: isDev ? "development" : "production",
  target: "electron-preload",
  devtool: isDev ? "source-map" : false,
  entry: path.join(__dirname, "src", "preload", "index"),
  output: {
    filename: "preload.js",
    path: path.resolve(outputPath, "scripts"),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: resolveExt,
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfigPath })],
  },
  plugins: [],
};

var chatbox = {
  mode: isDev ? "development" : "production",
  target: "electron-preload",
  devtool: isDev ? "source-map" : false,
  entry: path.join(__dirname, "src", "preload", "chatbox"),
  output: {
    filename: "chatbox.js",
    path: path.resolve(outputPath, "scripts"),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: resolveExt,
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfigPath })],
  },
  plugins: [],
};

var superchat = {
  mode: isDev ? "development" : "production",
  target: "electron-preload",
  devtool: isDev ? "source-map" : false,
  entry: path.join(__dirname, "src", "preload", "SuperChat", "superchat"),
  output: {
    filename: "superchat.js",
    path: path.resolve(outputPath, "scripts"),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: resolveExt,
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfigPath })],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "preload", "SuperChat", "superchat.html"),
          to: path.resolve(__dirname, outputPath),
        },
      ],
    }),
  ],
};

var setting = {
  mode: isDev ? "development" : "production",
  target: "electron-preload",
  devtool: isDev ? "source-map" : false,
  entry: path.join(__dirname, "src", "preload", "setting", "setting"),
  output: {
    filename: "setting.js",
    path: path.resolve(outputPath, "scripts"),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: resolveExt,
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfigPath })],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "preload", "Setting", "setting.html"),
          to: path.resolve(__dirname, outputPath),
        },
      ],
    }),
  ],
};

module.exports = [main, preload, chatbox, superchat, setting];
