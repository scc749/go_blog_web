<template>
  <div class="gaode-config">
    <el-col :span="12">
      <div class="info">
        <div class="title">
          <el-row>高德配置</el-row>
        </div>
        <div class="content">
          <el-form
              :model="gaodeInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="是否开启">
              <el-switch v-model="gaodeInfo.enable" @change="updateGaodeInfo"/>
            </el-form-item>
            <el-form-item label="高德密钥">
              <el-input @change="updateGaodeInfo" v-model="gaodeInfo.key" type="password" show-password/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {type Gaode, getGaode, updateGaode} from "@/api/config";

const gaodeInfo = ref<Gaode>({
  enable: false,
  key: '',
})

const getGaodeInfo = async () => {
  const res = await getGaode()
  if (res.code === 0) {
    gaodeInfo.value = res.data
  }
}

getGaodeInfo()

const shouldRefreshInfo = ref(false)
watch(() => shouldRefreshInfo.value, (newVal) => {
  if (newVal) {
    getGaodeInfo()
    shouldRefreshInfo.value = false
  }
})

const updateGaodeInfo = async () => {
  const res = await updateGaode(gaodeInfo.value)
  console.log(gaodeInfo.value)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    shouldRefreshInfo.value = true
  }
}
</script>

<style scoped lang="scss">
.gaode-config {
  display: flex;

  .info {
    .title {
      border-left: 5px solid blue;
      padding-left: 10px;
    }

    .content {
      margin: 20px;
    }
  }
}
</style>
