import main from './main2多入口';
import Vue from 'vue';
import App from '@/App2多入口';
import './index.css';
import './style.scss';

// // 这个是注释
// console.log(111111); // lkdsjk
// console.log(2666666); 
// console.log(process.env);

// const低版本浏览器解析不了
// 要进行转义，下载配置babel  建立.babelrc文件
// 低版本浏览器const转为var
const ab = 'index.js'
const y = (x) => {
    console.log(x, '多入口22222222222222')
}
y(ab)

// webpack设置， 用来判断开发或生产环境
console.log(process.env.NODE_ENV, '多入口llllllllllll');

new Vue({
     // el代表document.qu取真实dom
    // 下面的模块都放在#app的dom中
    el: '#app',  // 指处理html模板的盒子类名

    // runtime + compiler
    // 如果是解析字符串类型，就用这种，js类型使用render， 一般建议使用render
    // components: {
    //     App
    // },
    // template: '<App/>',  // template可以直接解析html，包括指令语法<h3>我是表情</h3>------------------------------------------

    // runtime-only 性能好 会预编译，在运行编译时会先通过vue-loader转换为js，运行时直接执行, 直接运行render函数
    // runtime + compiler运行编译时才会编译模板   指template载入模块文件
    // runtime-only要比runtime + compiler小30%，

    // runtime-only 
    render: h => h(App)
})

// Vue.createApp(App).mount('#app')