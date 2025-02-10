<template>
  <div class="web">
    <el-container>
      <router-view/>
      <el-footer>
        <web-footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import WebFooter from "@/components/layout/WebFooter.vue";
</script>

<style scoped lang="scss">
.web {
  .el-footer {
    height: auto;
    border: 1px solid #DCDFE6;
  }
}
</style>
