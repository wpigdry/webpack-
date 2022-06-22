// postcss-loader 配置文件
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}

// 也可直接在 webpack.config.js 中配置
// {
//     test: /\.css$/,
//     use: [
//       'style-loader',
//       'css-loader',
//       {
//         loader: 'postcss-loader',
//         options: {
//           plugins: [
//             require('autoprefixer')
//           ]
//         }
//       }
//     ]
// }