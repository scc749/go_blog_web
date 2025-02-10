<template>
  <div class="qq-config">
    <el-col :span="12">
      <div class="info">
        <div class="title">
          <el-row>QQ登录配置</el-row>
        </div>
        <div class="content">
          <el-form
              :model="qqInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >

            <el-form-item label="启用QQ登录">
              <el-switch v-model="qqInfo.enable" @change="updateQQInfo"/>
            </el-form-item>
            <el-form-item label="应用ID">
              <el-input @change="updateQQInfo" v-model="qqInfo.app_id"/>
            </el-form-item>
            <el-form-item label="应用密钥">
              <el-input @change="updateQQInfo" v-model.number="qqInfo.app_key" type="password" show-password/>
            </el-form-item>
            <el-form-item label="网站回调域">
              <el-input @change="updateQQInfo" v-model="qqInfo.redirect_uri"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {getQQ, type QQ, updateQQ} from "@/api/config";

const qqInfo = ref<QQ>({
  enable: false,
  app_id: '',
  app_key:'',
  redirect_uri: '',
})

const getQQInfo = async () => {
  const res = await getQQ()
  if (res.code === 0) {
    qqInfo.value = res.data
  }
}

getQQInfo()

const shouldRefreshInfo = ref(false)
watch(() => shouldRefreshInfo.value, (newVal) => {
  if (newVal) {
    getQQInfo()
    shouldRefreshInfo.value = false
  }
})

const updateQQInfo = async () => {
  const res = await updateQQ(qqInfo.value)
  console.log(qqInfo.value)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    shouldRefreshInfo.value = true
  }
}
</script>

<style scoped lang="scss">
.qq-config {
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
