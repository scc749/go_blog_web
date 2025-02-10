<template>
  <div class="system-config">
    <el-col :span="12">
      <div class="info">
        <div class="title">
          <el-row>系统配置</el-row>
        </div>
        <div class="content">
          <el-form
              :model="systemInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="多地点登录拦截">
              <el-switch v-model="systemInfo.use_multipoint" @change="updateSystemInfo"/>
            </el-form-item>
            <el-form-item label="会话密钥">
              <el-input @change="updateSystemInfo" v-model="systemInfo.sessions_secret" type="password" show-password/>
            </el-form-item>
            <el-form-item label="图片存储类型">
              <el-select
                  @change="updateSystemInfo"
                  v-model="systemInfo.oss_type"
                  placeholder="Select"
              >
                <el-option
                    v-for="item in ossTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {type System, getSystem, updateSystem} from "@/api/config";

const systemInfo = ref<System>({
  use_multipoint: false,
  sessions_secret: '',
  oss_type: '',
})

const ossTypeOptions =[

  {
    value: 'local',
    label: '本地',
  },
  {
    value: 'qiniu',
    label: '七牛',
  },
]

const getSystemInfo = async () => {
  const res = await getSystem()
  if (res.code === 0) {
    systemInfo.value = res.data
  }
}

getSystemInfo()

const shouldRefreshInfo = ref(false)
watch(() => shouldRefreshInfo.value, (newVal) => {
  if (newVal) {
    getSystemInfo()
    shouldRefreshInfo.value = false
  }
})

const updateSystemInfo = async () => {
  const res = await updateSystem(systemInfo.value)
  console.log(systemInfo.value)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    shouldRefreshInfo.value = true
  }
}
</script>

<style scoped lang="scss">
.system-config {
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
