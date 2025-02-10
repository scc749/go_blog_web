<template>

  <web-navbar :noScroll="true"/>
  <div class="error">
  <el-image src="/image/404.jpg" alt=""/>
  </div>

  <web-footer/>
</template>

<script setup lang="ts">

import WebNavbar from "@/components/layout/WebNavbar.vue";
import WebFooter from "@/components/layout/WebFooter.vue";
</script>

<style scoped lang="scss">
.error{
  display: flex;
  .el-image {
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
    height: 500px;
    width: auto;
  }
}

</style>
