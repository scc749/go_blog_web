<template>
  <div class="feedback-list">
    <div class="title">
      <el-row>反馈列表</el-row>
      <el-button-group>
        <el-button type="danger" icon="Delete" @click="feedbackBulkDeleteVisible = true;handleIdsToDelete()">
          批量删除
        </el-button>

        <el-dialog
            v-model="feedbackBulkDeleteVisible"
            width="500"
            align-center
            destroy-on-close
        >
          <template #header>
            删除反馈
          </template>
          您已选中 [{{ idsToDelete.length }}] 项资源，删除后将无法恢复，是否确认删除？
          <template #footer>
            <el-button type="primary" @click="handleBulkDelete(idsToDelete)">
              确定
            </el-button>
            <el-button @click="feedbackBulkDeleteVisible = false">取消</el-button>
          </template>
        </el-dialog>
      </el-button-group>
    </div>

    <el-table
        ref="multipleFeedbackTableRef"
        :data="feedbackTableData"
        :row-style="{height: '120px'}"
    >
      <el-table-column type="selection" width="60"/>
      <el-table-column label="用户" width="80">
        <template #default="scope:{ row: Feedback, column: any, $index: number }">
          <user-card-popover :uuid="scope.row.user_uuid"/>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="150">
        <template #default="scope:{ row: Feedback, column: any, $index: number }">
          {{ getTime(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容"/>
      <el-table-column prop="reply" label="回复"/>
      <el-table-column label="操作" width="180">
        <template #default="scope:{ row: Feedback, column: any, $index: number }">
          <el-button
              v-if="scope.row.reply===''"
              type="primary"
              @click="layoutStore.state.feedbackReplyVisible=true;feedbackInfo=scope.row"
          >
            回复
          </el-button>
          <el-button
              type="danger"
              @click="feedbackDeleteVisible=true;feedbackInfo=scope.row"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="feedbackReplyVisible"
        width="500"
        align-center
        destroy-on-close
        :before-close="feedbackReplyVisibleSynchronization"
    >
      <template #header>
        回复反馈
      </template>
      <feedback-reply-form :id="feedbackInfo.id"/>
      <template #footer>
      </template>
    </el-dialog>

    <el-dialog
        v-model="feedbackDeleteVisible"
        width="500"
        align-center
        destroy-on-close
    >
      <template #header>
        删除反馈
      </template>
      您已选中 [1] 项资源，删除后将无法恢复，是否确认删除？
      <template #footer>
        <el-button type="primary" @click="handleDelete(feedbackInfo.id)">
          确定
        </el-button>
        <el-button @click="feedbackDeleteVisible = false">取消</el-button>
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
import {useLayoutStore} from "@/stores/layout";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import {type Feedback, feedbackDelete, type FeedbackDeleteRequest, feedbackList} from "@/api/feedback";
import type {PageInfo} from "@/api/common";
import FeedbackReplyForm from "@/components/forms/FeedbackReplyForm.vue";
import UserCardPopover from "@/components/common/UserCardPopover.vue";


const multipleFeedbackTableRef = ref()
const feedbackTableData = ref<Feedback[]>()
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const layoutStore = useLayoutStore()

const feedbackBulkDeleteVisible = ref(false)
let idsToDelete: number[]

const handleIdsToDelete = () => {
  idsToDelete = []

  const rows: Feedback[] = multipleFeedbackTableRef.value.getSelectionRows()
  rows.forEach(row => {
    idsToDelete.push(row.id)
  })
}

const handleBulkDelete = async (ids: number[]) => {
  const requestData: FeedbackDeleteRequest = {
    ids: ids
  }
  const res = await feedbackDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  feedbackBulkDeleteVisible.value = false
  layoutStore.state.shouldRefreshFeedbackTable = true
}

const feedbackListRequest = reactive<PageInfo>({
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})

const getFeedbackTableData = async () => {
  feedbackListRequest.page = page.value
  feedbackListRequest.page_size = page_size.value

  const table = await feedbackList(feedbackListRequest)

  if (table.code === 0) {
    feedbackTableData.value = table.data.list
    total.value = table.data.total

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        page: feedbackListRequest.page,
        page_size: feedbackListRequest.page_size,
      },
    })
  }
}

watch(() => route.query, (newQuery) => {
  feedbackListRequest.page = Number(newQuery.page) || 1
  feedbackListRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getFeedbackTableData()
})

let feedbackInfo: Feedback
const feedbackDeleteVisible = ref(false)

const feedbackReplyVisible = ref(layoutStore.state.feedbackReplyVisible)
watch(
    () => layoutStore.state.feedbackReplyVisible,
    (newValue) => {
      feedbackReplyVisible.value = newValue
    }
)

const feedbackReplyVisibleSynchronization = () => {
  layoutStore.state.feedbackReplyVisible = false
}

const handleDelete = async (id: number) => {
  let ids: number[] = []
  ids.push(id)

  const requestData: FeedbackDeleteRequest = {
    ids: ids
  }

  const res = await feedbackDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  feedbackDeleteVisible.value = false
  layoutStore.state.shouldRefreshFeedbackTable = true
}

watch(() => layoutStore.state.shouldRefreshFeedbackTable, (newVal) => {
  if (newVal) {
    getFeedbackTableData()
    layoutStore.state.shouldRefreshFeedbackTable = false
  }
})

const getTime = (date: Date): string => {
  const time = new Date(date)
  return time.toLocaleString()
}

const handleSizeChange = (val: number) => {
  page_size.value = val
  getFeedbackTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getFeedbackTableData()
}
</script>

<style scoped lang="scss">
.feedback-list {
  .title {
    display: flex;
    margin-bottom: 20px;

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

  .el-table {
    border: 1px solid #DCDFE6;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
