// webpack 基于node node基于commonjs

// 配置html压缩规则
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist打包文件
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); // 有的旧版本不需要解构，直接const常量使用
// css抽离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    // 指定打包方式为 production || development
    mode: 'development',
    // 指定入口文件 关联js
    // 按照入口文件的依赖递归查找进行打包
    entry: {
        // 按照入口文件递归查找import相关的依赖进行打包
        'app': './src/index.js'
    },
    // 指定出口文件
    output: {
        // 打包到哪里
        path: path.resolve('dist'),
        // 防止幂等问题  地址没变，文件没有更新
        // name和entry的app文件名称对应 也可以改名
        // 无变化不更新hash，读取之前的缓存文件  变化后更新hash，读取新的文件
        // 不加hash的话，更新文件后，两次访问的地址都是一样的，浏览器就会从缓存读取
        filename: '[name].[hash:8].js'
        // filename: '[name].[chunkhash:8].js'
    },
    // 用来配置loader（转换器）
    // loader让webpack拥有解析和加载非javaScript文件的能力
    // 比方解析加载 css jsx tsx 图片
    module: {
        rules: [
            {
                test: /\.css$/, // .css结尾的文件
                use: [
                    // 会对 @import 和 url() 进行处理
                    // 默认生成一个数组存放处理后的样式字符串，并将其导出。
                    MiniCssExtractPlugin.loader, // 放在loader之前加载  css抽离
                    'css-loader', // 使用css-loader解析.css结尾的文件
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/, // .scss结尾的文件
                // 解析.scss结尾的文件
                use: [
                    MiniCssExtractPlugin.loader, // 放在loader之前加载   css抽离
                    // 加载有顺序，css-loader放在sass-loader之前
                    // 解析css文件的css
                    'css-loader',
                    // 解析后的css加入到html的style标签
                    // style-loader的作用是把 CSS 插入到 DOM 中，就是处理css-loader导出的模块数组，然后将样式通过style标签或者其他形式插入到DOM中。
                    // 'style-loader',
                    // 'sass-loader', //将scss编译成css
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'postcss-loader'
                    // {
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         sourceMap: true
                    //     }
                    // }
                ]
            }
        ]
    },
    // 使用插件
    plugins: [
        // 实例化使用

        // 清理dist文件，  会根据出口文件的名称清理掉旧的文件
        // 配合output的path设置为dist，每次打包清除dist文件夹（output不设置可能会dist文件不清理多余文件）
        new CleanWebpackPlugin(),
        // 解析html 并自动引入js
        new HtmlWebpackPlugin({
            // 指向解析的模板地址
            // 因为配置文件在package.json中执行，所以文件路径是根目录下，'./'
            template: 'public/index.html',
            // 用于设置打包输出后的html模板名称
            filename: 'main.html',
            // 设置 js 这个打包文件是否插入html
            // false会删除html中--webpack打包后引入的script标签(src指向打包后的js)，但不会删除html本身自有的script标签
            inject: true, // 默认为true  
            // 配置压缩规则
            minify: {
                html5: true, // 根据 HTML5 规范解析输入
                minifyCSS: true, // 压缩内联css
                preserveLineBreaks: true, // 当标签之间的空格包含换行符时，总是折叠到 1 个换行符（永远不要完全删除它）
                collapseWhitespace: true, // 移除空白符和换行符
                removeComments: true, // 移除html的注释
                removeAttributeQuotes: true, // 尽可能删除属性周围的引号  
                removeEmptyAttributes: true, // 删除所有具有纯空格值的属性
                removeOptionalTags: true // 删除可选标签-- 它只去除 HTML、HEAD、BODY、THEAD、TBODY 和 TFOOT 元素的结束标签。 例如：只有末尾 </head>
            },
        }),
        new MiniCssExtractPlugin({
            // 设置打包后的文件名称
            filename: '[name].[hash:8].css' // 每次打包更新名称，防止get请求幂等问题
        })
    ],
    // 服务启动配置
    devServer: {
        port: 9090
    }
}