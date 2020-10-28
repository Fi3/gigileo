const path = require('path');

module.exports = {
  experiments: {
    syncWebAssembly: true,
  },
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "../static/build"),
    filename: "index.js",
  },
  mode: "production",
};
