<template>
  <div class="advertisement-create-form">
    <el-form
        :model="advertisementCreateFormData"
        :validate-on-rule-change="false"
    >
      <el-form-item label="广告图片" prop="ad_image">
        <el-upload
            :action="`${path}/image/upload`"
            drag
            with-credentials
            :headers="{'x-access-token':userStore.state.accessToken}"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleSuccess"
            name="image"
        >

          <el-image v-if="advertisementCreateFormData.ad_image" :src="advertisementCreateFormData.ad_image" alt=""/>

          <div v-else class="upload-content">
            <div class="container">
              <component is="UploadFilled" class="upload-filled"></component>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
            </div>
          </div>

          <template #tip>
            <div class="el-upload__tip">
              jpg/png/jpeg/ico/tiff/gif/svg/webp files with a size less than 20MB.
            </div>
          </template>
        </el-upload>

        <el-input
            v-model="advertisementCreateFormData.ad_image"
            size="large"
            disabled
        />
      </el-form-item>
      <el-form-item label="广告链接" prop="link">
        <el-input
            v-model="advertisementCreateFormData.link"
            size="large"
            placeholder="请输入广告链接"
        />
      </el-form-item>
      <el-form-item label="广告标题" prop="title">
        <el-input
            v-model="advertisementCreateFormData.title"
            size="large"
            placeholder="请输入广告标题"
        />
      </el-form-item>
      <el-form-item label="广告内容" prop="content">
        <el-input
            v-model="advertisementCreateFormData.content"
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
              @click="layoutStore.state.advertisementCreateVisible = false"
          >取消
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {advertisementCreate} from "@/api/advertisement";
import type {AdvertisementCreateRequest} from "@/api/advertisement";
import type {ApiResponse} from "@/utils/request";
import type {ImageUploadResponse} from "@/api/image";
import {useUserStore} from "@/stores/user";
import {useLayoutStore} from "@/stores/layout";

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const path = ref(import.meta.env.VITE_BASE_API)

const advertisementCreateFormData = reactive<AdvertisementCreateRequest>({
  ad_image: "",
  link: "",
  title: "",
  content: "",
})
const handleSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    advertisementCreateFormData.ad_image = res.data.url
    ElMessage.success(res.msg)
  }
}


const submitForm = async () => {
  const res = await advertisementCreate(advertisementCreateFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.shouldRefreshAdvertisementTable = true
    layoutStore.state.advertisementCreateVisible = false
  }
}
</script>

<style scoped lang="scss">
.advertisement-create-form {
  .el-form {
    .el-form-item {
      .el-image {
        height: 120px;
      }

      .upload-content {
        display: flex;
        height: 120px;

        .container {
          margin: auto;

          .upload-filled {
            height: 32px;
            width: 32px;
          }
        }
      }

      .button-group {
        margin-left: auto;
      }
    }
  }
}
</style>

<style lang="scss">
.el-upload {
  --el-upload-dragger-padding-horizontal: 0px;
  --el-upload-dragger-padding-vertical: 0px;
  line-height: 0;
}
</style>
