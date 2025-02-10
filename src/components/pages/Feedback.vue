<template>
  <el-card class="feedback">
    <el-row class="title">意见反馈</el-row>
    <el-input type="textarea" :rows="4" v-model="feedbackCreateFormData.content" maxlength="100" show-word-limit
              placeholder="请输入反馈建议"></el-input>
    <div class="content">
      <el-text>tip:请登录后再进行反馈!</el-text>
      <div class="button-group">
        <el-button @click="submitForm" type="primary">确定</el-button>
        <el-button @click="feedbackCreateFormData.content=''">取消</el-button>
      </div>
    </div>
    <el-row class="title-sub">反馈列表</el-row>
    <div class="footer">
      <div class="feedback-new" v-for="item in feedbackInfoList">
        <el-row>{{ item.content }}</el-row>
        <el-row class="container">
          <div class="time">{{ item.time }}</div>
        </el-row>
        <div class="reply">
          <el-text v-if="item.reply!==''">回复：{{ item.reply }}</el-text>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {feedbackCreate, type FeedbackCreateRequest, feedbackNew} from "@/api/feedback";

const feedbackCreateFormData = reactive<FeedbackCreateRequest>({
  content: '',
})

interface FeedbackNew {
  content: string;
  reply: string;
  time: string;
}

const feedbackInfoList = ref<FeedbackNew[]>([])

const shouldRefreshFeedbackInfoTable = ref(false)
watch(() => shouldRefreshFeedbackInfoTable.value, (newVal) => {
  if (newVal) {
    getFeedbackNew()
    shouldRefreshFeedbackInfoTable.value = false;
  }
})

const submitForm = async () => {
  const res = await feedbackCreate(feedbackCreateFormData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    feedbackCreateFormData.content = ''
    shouldRefreshFeedbackInfoTable.value = true
  }
}

const getFeedbackNew = async () => {
  feedbackInfoList.value = []
  const res = await feedbackNew()
  if (res.code === 0) {
    res.data.forEach(value => {
      const date = new Date(value.created_at);
      const info: FeedbackNew = {
        content: value.content,
        reply: value.reply,
        time: date.toLocaleString(),
      }
      feedbackInfoList.value.push(info)
    })
  }
}

getFeedbackNew()
</script>

<style scoped lang="scss">
.feedback {
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .content {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;

    .button-group {
      margin-left: auto;
    }
  }

  .title-sub{
    font-size: large;
    margin-bottom: 20px;
  }

  .footer {
    .feedback-new {
      border: 1px solid #DCDFE6;
      margin-bottom: 20px;
      padding: 10px;

      .container {
        border-bottom: 1px solid #DCDFE6;
        display: flex;

        .time {
          font-size: small;
          margin-left: auto;
        }
      }

      .reply {
        font-size: small;
        padding: 10px;
      }
    }
  }
}
</style>
