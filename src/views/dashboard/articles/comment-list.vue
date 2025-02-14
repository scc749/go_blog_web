<template>
  <div class="comment-list">
    <div class="title">
      <el-row>评论列表</el-row>
      <el-button-group>

        <el-button type="danger" icon="Delete" @click="commentBulkDeleteVisible = true;handleIdsToDelete()">
          批量删除
        </el-button>

        <el-dialog
            v-model="commentBulkDeleteVisible"
            width="500"
            align-center
            destroy-on-close
        >
          <template #header>
            删除评论
          </template>
          您已选中 [{{ idsToDelete.length }}] 项资源，删除后将无法恢复，是否确认删除？
          <template #footer>
            <el-button type="primary" @click="handleBulkDelete(idsToDelete)">
              确定
            </el-button>
            <el-button @click="commentBulkDeleteVisible = false">取消</el-button>
          </template>
        </el-dialog>
      </el-button-group>
    </div>

    <div class="comment-list-request">
      <el-form :inline="true" :model="commentListRequest">
        <el-form-item label="文章id">
          <el-input v-model="commentListRequest.article_id" placeholder="请输入文章id" clearable/>
        </el-form-item>
        <el-form-item label="用户uuid">
          <el-input v-model="commentListRequest.user_uuid" placeholder="请输入用户uuid" clearable/>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input v-model="commentListRequest.content" placeholder="请输入评论内容" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getCommentTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
        ref="multipleCommentTableRef"
        :data="commentTableData"
    >
      <el-table-column type="selection" width="60"/>
      <el-table-column label="文章id" width="200">
        <template #default="scope:{ row: Comment, column: any, $index: number }">
          <el-link :href="'/article/'+scope.row.article_id">{{ scope.row.article_id }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="80">
        <template #default="scope:{ row: Comment, column: any, $index: number }">
          <user-card-popover :uuid="scope.row.user_uuid"/>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template #default="scope:{ row: Comment, column: any, $index: number }">
          <MdPreview class="content" :modelValue="scope.row.content"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope:{ row: Comment, column: any, $index: number }">
          <el-button
              type="danger"
              @click="commentDeleteVisible=true;commentInfo=scope.row"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="commentDeleteVisible"
        width="500"
        align-center
        destroy-on-close
    >
      <template #header>
        删除评论
      </template>
      您已选中 [1] 项资源，删除后将无法恢复，是否确认删除？
      <template #footer>
        <el-button type="primary" @click="handleDelete(commentInfo.id)">
          确定
        </el-button>
        <el-button @click="commentDeleteVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <el-pagination
        :current-page="page"
        :page-size="page_size"
        :page-sizes="[10, 30, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {
  type Comment,
  commentDelete, type CommentDeleteRequest,
  commentList,
  type CommentListRequest
} from "@/api/comment";
import {useLayoutStore} from "@/stores/layout";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import UserCardPopover from "@/components/common/UserCardPopover.vue";
import {MdPreview} from "md-editor-v3";


const multipleCommentTableRef = ref()
const commentTableData = ref<Comment[]>()
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const layoutStore = useLayoutStore()

const commentBulkDeleteVisible = ref(false)
let idsToDelete: number[]

const handleIdsToDelete = () => {
  idsToDelete = []

  const rows: Comment[] = multipleCommentTableRef.value.getSelectionRows()
  rows.forEach(row => {
    idsToDelete.push(row.id)
  })
}

const handleBulkDelete = async (ids: number[]) => {
  const requestData: CommentDeleteRequest = {
    ids: ids
  }
  const res = await commentDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  commentBulkDeleteVisible.value = false
  layoutStore.state.shouldRefreshCommentTable = true
}

const commentListRequest = reactive<CommentListRequest>({
  article_id: null,
  user_uuid: null,
  content: null,
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  commentListRequest.article_id = route.query.article_id as string || null
  commentListRequest.user_uuid = route.query.user_uuid as string || null
  commentListRequest.content = route.query.content as string || null
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})

const getCommentTableData = async () => {
  if (commentListRequest.article_id === "") {
    commentListRequest.article_id = null
  }
  if (commentListRequest.user_uuid === "") {
    commentListRequest.user_uuid = null
  }
  if (commentListRequest.content === "") {
    commentListRequest.content = null
  }

  commentListRequest.page = page.value
  commentListRequest.page_size = page_size.value

  const table = await commentList(commentListRequest)

  if (table.code === 0) {
    commentTableData.value = table.data.list
    total.value = table.data.total

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        article_id: commentListRequest.article_id,
        user_uuid: commentListRequest.user_uuid,
        content: commentListRequest.content,
        page: commentListRequest.page,
        page_size: commentListRequest.page_size,
      },
    })
  }
}

watch(() => route.query, (newQuery) => {
  commentListRequest.article_id = newQuery.article_id as string || null
  commentListRequest.user_uuid = newQuery.user_uuid as string || null
  commentListRequest.content = newQuery.content as string || null
  commentListRequest.page = Number(newQuery.page) || 1
  commentListRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getCommentTableData()
})

let commentInfo: Comment
const commentDeleteVisible = ref(false)

const handleDelete = async (id: number) => {
  let ids: number[] = []
  ids.push(id)

  const requestData: CommentDeleteRequest = {
    ids: ids
  }

  const res = await commentDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  commentDeleteVisible.value = false
  layoutStore.state.shouldRefreshCommentTable = true
}

watch(() => layoutStore.state.shouldRefreshCommentTable, (newVal) => {
  if (newVal) {
    getCommentTableData()
    layoutStore.state.shouldRefreshCommentTable = false
  }
})

const handleSizeChange = (val: number) => {
  page_size.value = val
  getCommentTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getCommentTableData()
}
</script>

<style scoped lang="scss">
.comment-list {
  .title {
    display: flex;

    .el-row {
      font-size: 24px;
    }

    .el-button-group {
      margin-left: auto;
      margin-top: auto;
      margin-bottom: auto;

      .el-button {
        margin-left: 32px;
      }
    }
  }

  .comment-list-request {
    border: 1px solid #DCDFE6;
    padding-top: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;

    .el-form {
      margin-left: auto;
    }
  }

  .el-table {
    border: 1px solid #DCDFE6;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
