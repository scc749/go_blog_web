<template>
<div class="feedback-reply-form">
  <el-form
      :model="feedbackReplyFormData"
      :validate-on-rule-change="false"
  >
    <el-form-item label="反馈回复" prop="reply">
      <el-input
          type="textarea"
          :rows="4"
          v-model="feedbackReplyFormData.reply"
          placeholder="请输入反馈回复"
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
            @click="layoutStore.state.feedbackReplyVisible = false"
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
import {useLayoutStore} from "@/stores/layout";
import {feedbackReply, type FeedbackReplyRequest} from "@/api/feedback";

const layoutStore = useLayoutStore()

const props = defineProps<{
  id: number;
}>();

const feedbackReplyFormData = reactive<FeedbackReplyRequest>({
  id: props.id,
  reply: '',
})

const submitForm = async () => {
  const res = await feedbackReply(feedbackReplyFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.shouldRefreshFeedbackTable = true
    layoutStore.state.feedbackReplyVisible = false
  }
}
</script>

<style scoped lang="scss">
.feedback-reply-form {
  .el-form {
    .el-form-item {
      .button-group {
        margin-left: auto;
      }
    }
  }
}
</style>
