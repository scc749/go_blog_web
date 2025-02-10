<template>
  <div class="advertisement-update-form">
    <el-form
        :model="advertisementUpdateFormData"
        :validate-on-rule-change="false"
    >

      <el-form-item label="广告图片" prop="ad_image">
        <el-image :src="props.advertisement.ad_image" alt=""/>
      </el-form-item>
      <el-form-item label="广告链接" prop="link">
        <el-input
            v-model="advertisementUpdateFormData.link"
            size="large"
            placeholder="请输入广告链接"
        />
      </el-form-item>
      <el-form-item label="广告标题" prop="title">
        <el-input
            v-model="advertisementUpdateFormData.title"
            size="large"
            placeholder="请输入广告标题"
        />
      </el-form-item>
      <el-form-item label="广告内容" prop="content">
        <el-input
            v-model="advertisementUpdateFormData.content"
            size="large"
            placeholder="请输入广告内容"
        />
      </el-form-item>
      <el-form-item>
        <div class="button-group">
          <el-button
              type="primary"
              size="large"
              @click="submitForm"
          >确定
          </el-button>
          <el-button
              size="large"
              @click="layoutStore.state.advertisementUpdateVisible = false"
          >取消
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {defineProps, reactive} from 'vue';
import {ElMessage} from "element-plus";
import {type Advertisement, advertisementUpdate, type AdvertisementUpdateRequest} from "@/api/advertisement";
import {useLayoutStore} from "@/stores/layout";

const layoutStore = useLayoutStore()

const props = defineProps<{
  advertisement: Advertisement;
}>();

const advertisementUpdateFormData = reactive<AdvertisementUpdateRequest>({
  id: props.advertisement.id,
  link: props.advertisement.link,
  title: props.advertisement.title,
  content: props.advertisement.content,
})

const submitForm = async () => {
  const res = await advertisementUpdate(advertisementUpdateFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.shouldRefreshAdvertisementTable = true
    layoutStore.state.advertisementUpdateVisible = false
  }
}
</script>

<style scoped lang="scss">
.advertisement-update-form {
  .el-form {
    .el-form-item {
      .el-image {
        height: 120px;
      }

      .button-group {
        margin-left: auto;
      }
    }
  }
}
</style>
