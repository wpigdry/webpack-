// webpack 基于node node基于commonjs

// webpack基于入口文件，顺着入口文件查找依赖，遇到不同的文件使用配置的loader转义，生成

// 配置html压缩规则
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist打包文件
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); // 有的旧版本不需要解构，直接const常量使用
// css抽离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 解析vue文件
const VuePlugin = require('vue-loader/lib/plugin');

// 用来复制public的文件到dist文件夹下，使打包时可以使用
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 合并module.exports导出的配置
const merge = require('webpack-merge');

const path = require('path');

const dev = require('./webpack.dev');
const online = require('./webpack.prod');

// webpack 公共文件抽离   指多个文件引用同一个文件 （抽离文件进行缓存）
// 多文件多入口的配置

const defaultConfig = {
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
    resolve: {
        // 配置省略后者名
        extensions: ['.vue', '.js', '.json', '.tsx', '.jsx'],
        // 配置别名
        alias: {
            // 配置下面这句开启runtime + compiler模式， runtime-only模式不需要
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('src')
        }
    },
    // 模块的解析规则  用来配置loader（转换器）
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
                    // 'postcss-loader'
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                // 解析.vue文件
                test: /\.vue$/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                // 排除解析node_modules的.js文件
                exclude: /\node_modules/
            },
            {
                test: /\.(gif|png|jpe?g)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 当文件小于50000b，将文件转换为base64的格式，用于减少http请求
                        // 当大于50000b，使用file-loader处理文件(自动处理，不用配置)
                        limit: 800000,
                        // 输出路径
                        outputPath: './images'
                    }
                }]
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
            filename: 'index.html', // 需要设置成public的html文件同名，才可以把打包的js链接到html
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
                // removeAttributeQuotes: true, // 尽可能删除属性周围的引号  
                removeEmptyAttributes: true, // 删除所有具有纯空格值的属性
                removeOptionalTags: true // 删除可选标签-- 它只去除 HTML、HEAD、BODY、THEAD、TBODY 和 TFOOT 元素的结束标签。 例如：只有末尾 </head>
            },
            // chunks表示该入口文件需要引入哪些chunk  公共的会抽离出去，（不会再次进行打包），不引入则使用不了该代码块
            chunks: ['vendor', 'common']
        }),
        new VuePlugin(),
        new MiniCssExtractPlugin({
            // 设置打包后的文件名称
            filename: '[name].[hash:8].css' // 每次打包更新名称，防止get请求幂等问题
        }),
        new CopyWebpackPlugin([
            {
                // 将./public的资源复制到./images
                // 定义要拷贝的源文件
                from: './public',
                // 定义要拷贝到的文件夹
                to: './public', // 默认指向dist文件夹
                // 排除  指定不需要复制的文件
                ignore: ['*.html']
            }
        ])
    ],
    optimization: {
        //生成chunki的地方,定义了2个chunk名字,即common和vendor
        //分割代码块
        splitChunks: {
            /**
             * all: 全部chunk  -- 全部公共代码块都处理
             * initial: 入口chunk，对于异步导入的文件不处理
             * async: 异步chunk，只对异步导入的文件处理
             */
            chunks: 'all',
            minSize: 30000,  // 表示在压缩前的最小模块大小, 默认值是30kb 大于30kb才会抽取
            // 缓存分组
            // 公共文件缓存的配置
            cacheGroup: {
                // 打包后的 dist 文件内，会生成 common.js 和 vendor.js 文件，此时包被拆开。之后，若公共模块代码未修改，则不会被再次打包
                // 第三方模块
                vendor: {
                    name: 'vendor', // chunk名称  也是打包后的文件名称
                    // 值越大优先级越高
                    priority: 1, // 优先级，先抽离公共的第三方库，再抽离业务代码，值越大优先级越高
                    test: /[\\/]node_modules[\\/]/, // 在node_modules范围内进行匹配
                    minSize: 0, // 模块大小限制 大于0个字节才会抽取
                    minChunks: 1, // 最少复用几次，若引入1次后，即对它抽离
                    reuseExistingChunk: true, //  如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                    enforce: true  // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
                },
                // 公共模块
                common: {
                    name: 'common', // chunk名称  也是打包后的文件名称
                    priority: 0, // 优先级
                    minSize: 0, // 公共模块大小限制
                    minChunks: 2 // 公共模块最少复用2次才会进行抽离
                }
            }
        }
    }
}

module.exports = env => {
    // process.env.NODE_ENV 配置中不能使用（开发中使用），只能使用传参形式
    // const {development} = env;
    // console.log(env, 'uuuuuuuuuuuuuu', development);

    return merge(defaultConfig, env === 'development' ? dev : online)
}