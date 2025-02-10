<template>
  <div class="friend-link-create-form">
    <el-form
        :model="friendLinkCreateFormData"
        :validate-on-rule-change="false"
    >
      <el-form-item label="logo图片" prop="logo">
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

          <el-image v-if="friendLinkCreateFormData.logo" :src="friendLinkCreateFormData.logo" alt=""/>

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
            v-model="friendLinkCreateFormData.logo"
            size="large"
            disabled
        />
      </el-form-item>
      <el-form-item label="友链链接" prop="link">
        <el-input
            v-model="friendLinkCreateFormData.link"
            size="large"
            placeholder="请输入友链链接"
        />
      </el-form-item>
      <el-form-item label="友链名称" prop="name">
        <el-input
            v-model="friendLinkCreateFormData.name"
            size="large"
            placeholder="请输入友链名称"
        />
      </el-form-item>
      <el-form-item label="友链描述" prop="description">
        <el-input
            v-model="friendLinkCreateFormData.description"
            size="large"
            placeholder="请输入友链描述"
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
              @click="layoutStore.state.friendLinkCreateVisible = false"
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
import {friendLinkCreate} from "@/api/friend-link";
import type {FriendLinkCreateRequest} from "@/api/friend-link";
import type {ApiResponse} from "@/utils/request";
import type {ImageUploadResponse} from "@/api/image";
import {useUserStore} from "@/stores/user";
import {useLayoutStore} from "@/stores/layout";

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const path = ref(import.meta.env.VITE_BASE_API)

const friendLinkCreateFormData = reactive<FriendLinkCreateRequest>({
  logo: "",
  link: "",
  name: "",
  description: "",
})
const handleSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    friendLinkCreateFormData.logo = res.data.url
    ElMessage.success(res.msg)
  }
}


const submitForm = async () => {
  const res = await friendLinkCreate(friendLinkCreateFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.shouldRefreshFriendLinkTable = true
    layoutStore.state.friendLinkCreateVisible = false
  }
}
</script>

<style scoped lang="scss">
.friend-link-create-form {
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
