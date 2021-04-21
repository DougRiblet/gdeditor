const path = require("path");

module.exports = {
  mode: 'development',
  entry: { index: path.resolve(__dirname, "client", "index.jsx") },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "client", "dist"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
};
