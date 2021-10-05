const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  mode: 'development',
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
}
