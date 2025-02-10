<template>
  <div class="user-comment">
    <el-row class="title">我的评论</el-row>
    <div class="table-data" v-for="item in userCommentTableData">
      <div class="link">
        <el-link :href="'/article/'+item.article_id">{{ item.article_id }}</el-link>
      </div>
      <div class="item">
        <comment-item :comments="[item]"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import CommentItem from "@/components/common/CommentItem.vue";
import {type Comment, commentInfo} from "@/api/comment";
import {useLayoutStore} from "@/stores/layout";


const userCommentTableData = ref<Comment[]>()
const getUserCommentTableData = async () => {
  const table = await commentInfo()

  if (table.code === 0) {
    userCommentTableData.value = table.data
  }
}
getUserCommentTableData()

const layoutStore = useLayoutStore()

watch(() => layoutStore.state.shouldRefreshCommentList, (newVal) => {
  if (newVal) {
    getUserCommentTableData()
  }
})
</script>

<style scoped lang="scss">
.user-comment {
  .title {
    margin-bottom: 20px;
    font-size: 24px;
  }

  .table-data {
    display: flex;
    border: 1px solid #DCDFE6;
    .link{
      width: 200px;
      display: flex;
      .el-link{
        text-align: center;
      }
    }
    .item{
      width: 100%;
    }
  }
}
</style>
