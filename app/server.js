var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config");
const url = require("url");
const express = require("express");

// const apiServer = process.env.PAS || "http://10.76.0.160:8000/";
// const apiServer = process.env.PAS || "http://35.229.237.27:8000/";
// const targetUrl = url.parse(apiServer);

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  // It suppress error shown in console, so it has to be set to false.
  quiet: false,
  // It suppress everything except error, so it has to be set to false as well
  // to see success build.
  noInfo: false,
  stats: "normal",
  // proxy: {
  //   "/api": {
  //     target: apiServer,
  //     secure: targetUrl.protocol == "https:",
  //     changeOrigin: true,
  //     logLevel: "debug"
  //   }
  // }
}).listen(3000, "localhost", function(err) {
  
  if (err) {
    console.log(err);
  }
  console.log("Listening at localhost:3000");
});
