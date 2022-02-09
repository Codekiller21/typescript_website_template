const path = require('path');
const { readFileSync } = require("fs");

const config = JSON.parse(readFileSync("webpack-build.json").toString());

module.exports = {
  //mode: "developmet",
  mode: (config.production ? "production" : "development"),
  //mode: "production",
  devtool: "inline-source-map",
  entry: {
    main: "./src/main.ts",
  },
  output: {
    path: path.resolve(__dirname, './build'),
    //filename: "[name]-bundle.js" // <--- Will be compiled to this single file
    filename: config.outputFilename
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};