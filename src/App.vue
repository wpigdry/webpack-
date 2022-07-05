<template>
    <div>
        <!-- 如果写在assets文件夹下，用require引用，public下用绝对路径 -->
        <img :src="Img" alt="">
        你好,我是vue文件
        <!-- public下用绝对路径，可以直接引入 -->
        <!-- 打包后，根据这个路径访问的是dist文件夹下的public，因为没有则直接报错 -->
        <!-- 下载copy-webpack-plugin插件复制public的资源到dist打包文件夹下-->
        <img src="public/images/line.png" alt="">

        <button @click="fn">按需加载</button>
    </div>
</template>

<script>

import Img from './assets/wj.png';

// import './assets/index.scss';

export default {
    name: 'App',
    data() {
        return {
            Img
        }
    },
    methods: {
        // 配置的插件版本错误，点击会报错
        async fn() {
            await 2;
            import('./assets/index.scss')
        }
    }
}
</script>