var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'wd-web-log.js',
    chunkFilename: '[id].js',
    path: path.resolve(__dirname, './dist'),
    library: 'WdWebLog',
    // libraryTarget 改为 umd 后，同时可用<script>标签引用组件
    libraryTarget: "umd",
    libraryExport: 'default',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:
        {
            presets: ['env', 'stage-3'],
            plugins: ['transform-runtime']
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  }
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        version: JSON.stringify(require('./package.json').version)
      },
      SDK_VERSION: JSON.stringify(process.env.npm_package_version)
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
