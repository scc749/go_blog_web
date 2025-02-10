<template>
  <el-card class="recent-comments">
    <el-row class="title">最新评论</el-row>
    <comment-item :comments="comments"/>
  </el-card>
</template>

<script setup lang="ts">
import CommentItem from "@/components/common/CommentItem.vue";
import {ref, watch} from "vue";
import {type Comment, commentNew} from "@/api/comment";
import {useLayoutStore} from "@/stores/layout";

const comments=ref<Comment[]>([])

const getRecentCommentInfo = async ()=>{
  const res = await commentNew()
  if (res.code===0){
    comments.value=res.data
  }
}

getRecentCommentInfo()

const layoutStore = useLayoutStore()

watch(() => layoutStore.state.shouldRefreshCommentList, (newVal) => {
  if (newVal) {
    getRecentCommentInfo()
  }
})
</script>

<style scoped lang="scss">
.recent-comments {
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
