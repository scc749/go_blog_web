<template>
  <el-card class="advertisement">
    <el-row class="title">独家推广</el-row>
    <el-carousel :interval="5000" type="card" height="320px" @change="handleCarouselChange">
      <el-carousel-item v-for="(advertisement, index) in advertisementList" :key="advertisement">
        <el-image v-if="loadedImageIndices.has(index)" :src="advertisement.ad_image" alt="" loading="lazy"
                  @click="handleAdverisementClick(advertisement)"></el-image>
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
const loadedImageIndices = ref(new Set<number>())

const loadImagesAround = (index: number) => {
  const imageCount = advertisementList.value?.length ?? 0
  if (imageCount === 0) {
    return
  }

  const loaded = new Set(loadedImageIndices.value)
  loaded.add(index)
  if (imageCount > 1) {
    loaded.add((index + 1) % imageCount)
    loaded.add((index - 1 + imageCount) % imageCount)
  }
  loadedImageIndices.value = loaded
}

const handleCarouselChange = (index: number) => loadImagesAround(index)

const getAdvertisementList = async () => {
  const res = await advertisementInfo()
  if (res.code == 0) {
    advertisementList.value = res.data.list
    loadedImageIndices.value = new Set<number>()
    loadImagesAround(0)
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
