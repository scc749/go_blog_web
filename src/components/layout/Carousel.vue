<template>
  <div class="carousel">
    <el-carousel trigger="click" height="700px" @change="handleCarouselChange">
      <el-carousel-item v-for="(item, index) in imgList" :key="item">
        <el-image v-if="loadedImageIndices.has(index)" fit="cover" :src="item" alt=""></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {websiteCarousel} from "@/api/website";

const imgList = ref<string[]>([
  '/image/carousel_1.jpg',
  '/image/carousel_2.jpg',
  '/image/carousel_3.jpg',
  '/image/carousel_4.jpg',
])
const loadedImageIndices = ref(new Set([0, 1]))

const handleCarouselChange = (index: number) => {
  const imageCount = imgList.value.length
  if (imageCount === 0) {
    return
  }

  const loaded = new Set(loadedImageIndices.value)
  loaded.add(index)
  loaded.add((index + 1) % imageCount)
  loadedImageIndices.value = loaded
}

const getWebsiteCarousel = async () => {
  const res = await websiteCarousel()
  if (res.code === 0 && res.data.length !== 0) {
    imgList.value = res.data
    loadedImageIndices.value = new Set(res.data.length > 1 ? [0, 1] : [0])
  }
}

getWebsiteCarousel()
</script>

<style scoped lang="scss">
.carousel {
  width: 100%;
  position: relative;

  .el-carousel {
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
