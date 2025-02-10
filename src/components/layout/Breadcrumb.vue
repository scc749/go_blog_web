<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <template v-for="item in route.matched">
        <el-breadcrumb-item v-if="item.components" :to="{ path: item.path }"> {{ item.meta.title }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else>{{ item.meta.title }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
</script>

<style scoped lang="scss">
.el-breadcrumb {
  font-size: 18px;
  padding-bottom: 15px;
  padding-top: 15px;
}
</style>
