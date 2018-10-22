var path = require("path") 
var webpack = require("webpack") 
const HtmlWebpackPlugin = require("html-webpack-plugin") 
const CleanWebpackPlugin = require("clean-webpack-plugin") 
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const os = require('os')
const HappyPack  = require('happypack')
const happThreadPool = HappyPack.ThreadPool({size: os.cpus().length})

module.exports = {
  entry: ["babel-polyfill", "./src/main.js" ],
  // entry: {
  //   app: "./src/main.js"
  // },
  output: {
    path: path.resolve(__dirname, "./dist"),
    // 这个东西呢，是index.html和资源文件之间的相对路劲设置
    publicPath: "/",
    filename: "[name].[hash].js",
    chunkFilename: '[name].[hash].js',
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [path.resolve(__dirname, './src')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.js$/,
        loader: ['happypack/loader?id=js'], // 将loader换成happypack
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            js: 'happypack/loader?id=js' // 将loader换成happypack
          }
        }
      },
     
      {
        test: /\.s[a|c]ss$/,
        use: 'happypack/loader?id=styles'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name][hash].[ext]"
        }
      },
      {
        // add jpg/png/gif here can make it base64, but need to delete above file-loader
        test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new HappyPack({
      id: 'js',
      threads: 4,
      cache: true,
      loaders: ['babel-loader'],
      threadPool: happThreadPool
    }),
    new HappyPack({
      id: 'styles',
      threads: 4,
      loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
    }),
    new HtmlWebpackPlugin({
      title: "1Token.trade",
      template: "./html/production-template.html"
    }),
    
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "./src")
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  devServer: {
    // for localhost test(work with inner-network IP)
    // host: '0.0.0.0',
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    proxy: {
      "/api": {
        target: "https://1token.trade/api",
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: "#source-map"
} 

if (process.env.NODE_ENV === "production") {
  // for cdn
  module.exports.output.publicPath = 'https://cdn.1tokentrade.cn/otimg-sh/web-deploy/'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BundleAnalyzerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: 'used-twice',
      minChunks: (module, count) => (
        count >= 2
      ),
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: ({ resource }) => (
    //     resource &&
    //     resource.indexOf('node_modules') >= 0 &&
    //     resource.match(/\.js$/)
    //   ),
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   async: 'used-twice',
    //   minChunks: (module, count) => (
    //     count >= 2
    //   ),
    // }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin(["dist"]),
    new UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]) 
}
