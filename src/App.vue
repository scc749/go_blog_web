<template>
  <div id="app">
    <el-config-provider :locale="zhCn">
      <router-view/>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<style scoped>
</style>
