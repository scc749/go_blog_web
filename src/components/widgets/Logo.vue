<template>
  <div class="logo">
    <el-image
        :src="websiteStore.state.websiteInfo.logo===''?'/image/logo.png':websiteStore.state.websiteInfo.logo"
        alt=""/>
    <div class="brand-info">
      <div>{{ websiteStore.state.websiteInfo.slogan }}</div>
      <div>{{ websiteStore.state.websiteInfo.slogan_en }}</div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {useWebsiteStore} from "@/stores/website";

const websiteStore = useWebsiteStore()
</script>

<style scoped lang="scss">
.dashboard {
  .logo {
    display: flex;
    padding: 10px;

    .el-image {
      height: 60px;
      width: 60px;
    }

    .brand-info {
      margin-top: 5px;
      margin-left: 20px;

      > div:nth-child(1) {
        font-size: 24px;
      }

      > div:nth-child(2) {
        font-size: 13px;
      }
    }
  }


  .collapsed {
    .logo {
      .el-image {
        height: 44px;
        width: 44px;
      }

      .brand-info {
        display: none;
      }
    }
  }
}


.web-navbar .logo {
  display: flex;

  .el-image {
    padding: 5px;
  }

  .brand-info {
    margin-top: 5px;

    > div:nth-child(1) {
      font-size: 22px;

    }

    > div:nth-child(2) {
      font-size: 12px;
    }
  }
}
</style>
