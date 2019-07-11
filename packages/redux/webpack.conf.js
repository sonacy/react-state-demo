const {
  resolve
} = require('path')
const {
  CheckerPlugin
} = require('awesome-typescript-loader')

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    app: resolve(__dirname, './src/index.tsx')
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    path: resolve(__dirname, './dist/')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.d.ts'],
    alias: {
      src: resolve(__dirname, './src/'),
      "react-cache": "@react-state-demo/react-cache",
      "scheduler": "@react-state-demo/scheduler"
    }
  },
  module: {
    rules: [{
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        enforce: "pre",
        test: /\.tsx?$/,
        loader: "tslint-loader"
      },
      {
        test: /\.(tsx?|jsx?)$/,
        loader: 'awesome-typescript-loader',
        options: {
          transpileOnly: true,
        },
        include: [
          resolve(__dirname, './src')
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')(),
              ]
            }
          },
        ]
      },
    ]
  },
  plugins: [
    new CheckerPlugin()
  ]
}