<template>
  <div class="index">
    <web-navbar/>
    <carousel/>
    <el-container class="main-content">
      <div class="container">
        <el-main>
          <advertisement/>
          <daily-news/>
          <article-list/>
        </el-main>

        <el-aside>
          <calendar/>
          <profile-card/>
          <tag-cloud/>
          <recent-comments/>
          <feedback/>
        </el-aside>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Carousel from "@/components/layout/Carousel.vue";
import WebNavbar from "@/components/layout/WebNavbar.vue";
import Advertisement from "@/components/pages/Advertisement.vue";
import DailyNews from "@/components/pages/DailyNews.vue";
import ArticleList from "@/components/pages/ArticleList.vue";
import Calendar from "@/components/pages/Calendar.vue";
import ProfileCard from "@/components/pages/ProfileCard.vue";
import TagCloud from "@/components/pages/TagCloud.vue";
import RecentComments from "@/components/pages/RecentComments.vue";
import Feedback from "@/components/pages/Feedback.vue";
</script>

<style scoped lang="scss">
.index {
  .main-content {
    display: flex;
    justify-content: center;

    .container {
      display: flex;
      max-width: 1400px;
      width: 100%;

      .el-main {
        width: 70%;
      }

      .el-aside {
        width: 30%;
        padding: 20px;
      }
    }
  }
}
</style>
