<template>
  <div class="email-config">
    <el-col :span="12">
      <div class="info">
        <div class="title">
          <el-row>邮箱配置</el-row>
        </div>
        <div class="content">
          <el-form
              :model="emailInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="服务器地址">
              <el-input @change="updateEmailInfo" v-model="emailInfo.host"/>
            </el-form-item>
            <el-form-item label="服务器端口">
              <el-input @change="updateEmailInfo" v-model.number="emailInfo.port"/>
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input @change="updateEmailInfo" v-model="emailInfo.from"/>
            </el-form-item>
            <el-form-item label="发件人昵称">
              <el-input @change="updateEmailInfo" v-model="emailInfo.nickname"/>
            </el-form-item>
            <el-form-item label="邮箱密钥">
              <el-input @change="updateEmailInfo" v-model="emailInfo.secret" type="password" show-password/>
            </el-form-item>
            <el-form-item label="使用SSL">
              <el-switch v-model="emailInfo.is_ssl" @change="updateEmailInfo"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {type Email, getEmail, updateEmail} from "@/api/config";

const emailInfo = ref<Email>({
  host: '',
  port: 0,
  from: '',
  nickname: '',
  secret: '',
  is_ssl: false,
})

const getEmailInfo = async () => {
  const res = await getEmail()
  if (res.code === 0) {
    emailInfo.value = res.data
  }
}

getEmailInfo()

const shouldRefreshInfo = ref(false)
watch(() => shouldRefreshInfo.value, (newVal) => {
  if (newVal) {
    getEmailInfo()
    shouldRefreshInfo.value = false
  }
})

const updateEmailInfo = async () => {
  const res = await updateEmail(emailInfo.value)
  console.log(emailInfo.value)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    shouldRefreshInfo.value = true
  }
}
</script>

<style scoped lang="scss">
.email-config {
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
