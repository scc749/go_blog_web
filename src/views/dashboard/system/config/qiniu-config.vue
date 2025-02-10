<template>
  <div class="qiniu-config">
    <el-col :span="12">
      <div class="info">
        <div class="title">
          <el-row>七牛配置</el-row>
        </div>
        <div class="content">
          <el-form
              :model="qiniuInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="存储区域">
              <el-input @change="updateQiniuInfo" v-model="qiniuInfo.zone"/>
            </el-form-item>
            <el-form-item label="空间名称">
              <el-input @change="updateQiniuInfo" v-model.number="qiniuInfo.bucket"/>
            </el-form-item>
            <el-form-item label="密钥 AK">
              <el-input @change="updateQiniuInfo" v-model="qiniuInfo.access_key" type="password" show-password/>
            </el-form-item>
            <el-form-item label="密钥 SK">
              <el-input @change="updateQiniuInfo" v-model="qiniuInfo.secret_key" type="password" show-password/>
            </el-form-item>
            <el-form-item label="CDN加速域名">
              <el-input @change="updateQiniuInfo" v-model="qiniuInfo.img_path"/>
            </el-form-item>
            <el-form-item label="使用CDN上传加速">
              <el-switch v-model="qiniuInfo.use_cdn_domains" @change="updateQiniuInfo"/>
            </el-form-item>
            <el-form-item label="使用Https">
              <el-switch v-model="qiniuInfo.use_https" @change="updateQiniuInfo"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {type Qiniu, getQiniu, updateQiniu} from "@/api/config";

const qiniuInfo = ref<Qiniu>({
  zone: '',
  bucket: '',
  img_path: '',
  access_key: '',
  secret_key: '',
  use_https: false,
  use_cdn_domains: false,
})

const getQiniuInfo = async () => {
  const res = await getQiniu()
  if (res.code === 0) {
    qiniuInfo.value = res.data
  }
}

getQiniuInfo()

const shouldRefreshInfo = ref(false)
watch(() => shouldRefreshInfo.value, (newVal) => {
  if (newVal) {
    getQiniuInfo()
    shouldRefreshInfo.value = false
  }
})

const updateQiniuInfo = async () => {
  const res = await updateQiniu(qiniuInfo.value)
  console.log(qiniuInfo.value)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    shouldRefreshInfo.value = true
  }
}
</script>

<style scoped lang="scss">
.qiniu-config {
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
