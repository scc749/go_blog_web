<template>
  <el-card class="advertisement">
    <el-row class="title">独家推广</el-row>
    <el-carousel :interval="5000" type="card" height="320px">
      <el-carousel-item v-for="advertisement in advertisementList" :key="advertisement">
        <el-image :src=advertisement.ad_image alt="" @click=handleAdverisementClick(advertisement)></el-image>
        <el-row>{{ advertisement.title }}</el-row>
        <el-text>{{ advertisement.content }}</el-text>
      </el-carousel-item>
    </el-carousel>
  </el-card>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {type Advertisement, advertisementInfo} from "@/api/advertisement";

const advertisementList = ref<Advertisement[]>()
const getAdvertisementList = async () => {
  const res = await advertisementInfo()
  if (res.code == 0) {
    advertisementList.value = res.data.list
  }
}
getAdvertisementList()

const handleAdverisementClick = (advertisement: Advertisement) => {
  window.open(advertisement.link)
}
</script>

<style scoped lang="scss">
.advertisement {
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .el-carousel__item {
    background-color: white;

    .el-image {
      height: 240px;
      width: 100%;
    }
  }
}
</style>
