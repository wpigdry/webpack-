// webpack 基于node node基于commonjs

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); // 有的旧版本不需要解构，直接const常量使用
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
            // 设置 js 文件是否插入html   css是否插入看后续视频---------
            inject: true, // 默认为true  false会删除html中的script标签
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
        })
    ],
    // 服务启动配置
    devServer: {
        port: 9090
    }
}