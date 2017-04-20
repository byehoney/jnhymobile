var webpack = require('webpack')

var ExtractTextPlugin = require("extract-text-webpack-plugin");  //css单独打包
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
 // path.resolve('/Public', './src/components/assets')  // 2. 自己私人的 svg 存放目录
];

module.exports = {
    devtool: false,

    entry: {
        main: './Public/src/entry.js', //唯一入口文件
        vendor: ['react']
    },
    output: {
        path: './Public/build', //打包后的文件存放的地方
        filename: 'main.js', //打包后输出文件的文件名
        publicPath: 'http://localhost:8888/Public/build/'  //启动本地服务后的根目录
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: "jsx!babel", include: /src/},
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss")},
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass")},
			{ test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=image/svg+xml',
				include: /Public/,
				exclude: /node_modules/
			},
			{
        test: /\.(svg)$/i,
        loader: 'svg-sprite',
        include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
		exclude: /Public/
      },
  { test: /\.(png|jpg|gif)$/,loader: 'url?limit=1000000' }
        ]
    },

    babel: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: ['transform-runtime', ['import', {
          libraryName: 'antd-mobile',
          style: 'css'
        }]]
    },

    postcss: [
        require('autoprefixer')    //调用autoprefixer插件,css3自动补全
    ],

    devServer: {
        contentBase: './Index',  //本地服务器所加载的页面所在的目录
        port: 8888,
        colors: true,  //终端中输出结果为彩色
        historyApiFallback: true,  //不跳转
        inline: true  //实时刷新
    },

    plugins: [
		new webpack.DefinePlugin({
			'process.env':{
				'NODE_ENV': JSON.stringify('production')
			}
		}),
        new ExtractTextPlugin('main.css'),
        new CommonsChunkPlugin({
           name: 'vendor',
           filename: 'vendor.js'
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
    ]

}
