<template>
    <div>
        <!-- 如果写在assets文件夹下，用require引用，public下用绝对路径 -->
        <img :src="Img" alt="">
        你好,我是vue文件
    </div>
</template>

<script>

import Img from './assets/wj.png';

export default {
    name: 'App',
    data() {
        return {
            Img
        }
    }
}
</script>