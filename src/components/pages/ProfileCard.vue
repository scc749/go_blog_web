<template>
  <el-card class="profile-card">
    <el-row class="title">个人名片</el-row>
    <div class="content">
      <el-row>昵称：{{ websiteStore.state.websiteInfo.name }}</el-row>
      <el-row>职业：{{ websiteStore.state.websiteInfo.job }}</el-row>
      <el-row>住址：{{ websiteStore.state.websiteInfo.address }}</el-row>
      <el-row>邮箱：{{ websiteStore.state.websiteInfo.email }}</el-row>
      <div class="contact">
        <div v-if="websiteStore.state.websiteInfo['qq_image']!==''">
          <el-image :src="websiteStore.state.websiteInfo['qq_image']" alt=""/>
          <el-row>QQ</el-row>
        </div>
        <div v-if="websiteStore.state.websiteInfo['wechat_image']!==''">
          <el-image :src="websiteStore.state.websiteInfo['wechat_image']" alt=""/>
          <el-row>微信</el-row>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {useWebsiteStore} from "@/stores/website";

const websiteStore = useWebsiteStore()
</script>

<style scoped lang="scss">
.profile-card {
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .content {
    .contact {
      display: flex;
      justify-content: center;

      .el-image {
        height: 100px;
        margin: 20px 20px 0;
      }

      .el-row {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
