// 配置开发环境
module.exports = {
    // 指定打包方式为 production || development
    mode: 'development',
    // 进行配置本地工具
    // 开发环境使用 方便调试 可以直接点击报错信息进行来源定位
    // build打包之后会生成js css的.map文件
    //# sourceMappingURL=app.760e4336.js.map   （打包后的文件url指向map文件）
    // 为开发环境时浏览器Sources会出现webpack，可以看报错映射
    // devtool: 'source-map', // 来源映射，可以映射到打包之前的代码
    // 开发环境服务启动配置   或者配代理
    devServer: {
        port: 9090
    }
}