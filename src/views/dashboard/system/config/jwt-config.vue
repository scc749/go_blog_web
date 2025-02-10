<template>
  <div class="jwt-config">
    <el-col :span="12">
      <div class="info">
        <div class="title">
          <el-row>Jwt配置</el-row>
        </div>
        <div class="content">
          <el-form
              :model="jwtInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="访问令牌密钥">
              <el-input @change="updateJwtInfo" v-model="jwtInfo.access_token_secret" type="password" show-password/>
            </el-form-item>
            <el-form-item label="访问令牌过期时间">
              <el-input @change="updateJwtInfo" v-model="jwtInfo.access_token_expiry_time"/>
            </el-form-item>
            <el-form-item label="刷新令牌密钥">
              <el-input @change="updateJwtInfo" v-model.number="jwtInfo.refresh_token_secret" type="password"
                        show-password/>
            </el-form-item>
            <el-form-item label="刷新令牌过期时间">
              <el-input @change="updateJwtInfo" v-model="jwtInfo.refresh_token_expiry_time"/>
            </el-form-item>
            <el-form-item label="签发者">
              <el-input @change="updateJwtInfo" v-model="jwtInfo.issuer"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {type Jwt, getJwt, updateJwt} from "@/api/config";

const jwtInfo = ref<Jwt>({
  access_token_secret: '',
  refresh_token_secret: '',
  access_token_expiry_time: '',
  refresh_token_expiry_time: '',
  issuer: '',
})

const getJwtInfo = async () => {
  const res = await getJwt()
  if (res.code === 0) {
    jwtInfo.value = res.data
  }
}

getJwtInfo()

const shouldRefreshInfo = ref(false)
watch(() => shouldRefreshInfo.value, (newVal) => {
  if (newVal) {
    getJwtInfo()
    shouldRefreshInfo.value = false
  }
})

const updateJwtInfo = async () => {
  const res = await updateJwt(jwtInfo.value)
  console.log(jwtInfo.value)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    shouldRefreshInfo.value = true
  }
}
</script>

<style scoped lang="scss">
.jwt-config {
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
