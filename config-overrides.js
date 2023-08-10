const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );
  config.module.rules.unshift({
    test: /\.m?js$/,
  });

  return config;
};
