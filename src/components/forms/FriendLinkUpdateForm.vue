<template>
  <div class="friend-link-update-form">
    <el-form
        :model="friendLinkUpdateFormData"
        :validate-on-rule-change="false"
    >

      <el-form-item label="logo图片" prop="logo">
        <el-image :src="props.friendLink.logo" alt=""/>
      </el-form-item>
      <el-form-item label="友链链接" prop="link">
        <el-input
            v-model="friendLinkUpdateFormData.link"
            size="large"
            placeholder="请输入友链链接"
        />
      </el-form-item>
      <el-form-item label="友链名称" prop="name">
        <el-input
            v-model="friendLinkUpdateFormData.name"
            size="large"
            placeholder="请输入友链名称"
        />
      </el-form-item>
      <el-form-item label="友链描述" prop="description">
        <el-input
            v-model="friendLinkUpdateFormData.description"
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
              @click="layoutStore.state.friendLinkUpdateVisible = false"
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
import {type FriendLink, friendLinkUpdate, type FriendLinkUpdateRequest} from "@/api/friend-link";
import {useLayoutStore} from "@/stores/layout";

const layoutStore = useLayoutStore()

const props = defineProps<{
  friendLink: FriendLink;
}>();

const friendLinkUpdateFormData = reactive<FriendLinkUpdateRequest>({
  id: props.friendLink.id,
  link: props.friendLink.link,
  name: props.friendLink.name,
  description: props.friendLink.description,
})

const submitForm = async () => {
  const res = await friendLinkUpdate(friendLinkUpdateFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.shouldRefreshFriendLinkTable = true
    layoutStore.state.friendLinkUpdateVisible = false
  }
}
</script>

<style scoped lang="scss">
.friend-link-update-form {
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
