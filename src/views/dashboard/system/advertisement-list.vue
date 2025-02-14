<template>
  <div class="advertisement-list">
    <div class="title">
      <el-row>广告列表</el-row>
      <el-button-group>
        <el-button type="success" icon="Plus" @click="layoutStore.state.advertisementCreateVisible = true">
          新建广告
        </el-button>

        <el-dialog
            v-model="advertisementCreateVisible"
            width="500"
            align-center
            destroy-on-close
            :before-close="advertisementCreateVisibleSynchronization"
        >
          <template #header>
            新建广告
          </template>
          <advertisement-create-form/>
          <template #footer>
          </template>
        </el-dialog>

        <el-button type="danger" icon="Delete" @click="advertisementBulkDeleteVisible = true;handleIdsToDelete()">
          批量删除
        </el-button>

        <el-dialog
            v-model="advertisementBulkDeleteVisible"
            width="500"
            align-center
            destroy-on-close
        >
          <template #header>
            删除广告
          </template>
          您已选中 [{{ idsToDelete.length }}] 项资源，删除后将无法恢复，是否确认删除？
          <template #footer>
            <el-button type="primary" @click="handleBulkDelete(idsToDelete)">
              确定
            </el-button>
            <el-button @click="advertisementBulkDeleteVisible = false">取消</el-button>
          </template>
        </el-dialog>
      </el-button-group>
    </div>

    <div class="advertisement-list-request">
      <el-form :inline="true" :model="advertisementListRequest">
        <el-form-item label="广告标题">
          <el-input v-model="advertisementListRequest.title" placeholder="请输入广告标题" clearable/>
        </el-form-item>
        <el-form-item label="广告内容">
          <el-input v-model="advertisementListRequest.content" placeholder="请输入广告内容" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getAdvertisementTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
        ref="multipleAdvertisementTableRef"
        :data="advertisementTableData"
    >
      <el-table-column type="selection" width="60"/>
      <el-table-column label="图片">
        <template #default="scope:{ row: any, column: any, $index: number }">
          <el-image :src="scope.row.ad_image" alt=""/>
        </template>
      </el-table-column>
      <el-table-column prop="link" label="链接"/>
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="content" label="内容"/>
      <el-table-column label="操作">
        <template #default="scope:{ row: any, column: any, $index: number }">
          <el-button
              type="warning"
              @click="layoutStore.state.advertisementUpdateVisible=true;advertisementInfo=scope.row"
          >
            更新
          </el-button>
          <el-button
              type="danger"
              @click="advertisementDeleteVisible=true;advertisementInfo=scope.row"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="advertisementUpdateVisible"
        width="500"
        align-center
        destroy-on-close
        :before-close="advertisementUpdateVisibleSynchronization"
    >
      <template #header>
        更新广告
      </template>
      <advertisement-update-form :advertisement=advertisementInfo />
      <template #footer>
      </template>
    </el-dialog>

    <el-dialog
        v-model="advertisementDeleteVisible"
        width="500"
        align-center
        destroy-on-close
    >
      <template #header>
        删除广告
      </template>
      您已选中 [1] 项资源，删除后将无法恢复，是否确认删除？
      <template #footer>
        <el-button type="primary" @click="handleDelete(advertisementInfo.id)">
          确定
        </el-button>
        <el-button @click="advertisementDeleteVisible = false">取消</el-button>
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
  type Advertisement,
  advertisementDelete, type AdvertisementDeleteRequest,
  advertisementList,
  type AdvertisementListRequest
} from "@/api/advertisement";
import {useLayoutStore} from "@/stores/layout";
import AdvertisementCreateForm from "@/components/forms/AdvertisementCreateForm.vue";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import AdvertisementUpdateForm from "@/components/forms/AdvertisementUpdateForm.vue";


const multipleAdvertisementTableRef = ref()
const advertisementTableData = ref<Advertisement[]>()
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const layoutStore = useLayoutStore()

const advertisementCreateVisible = ref(layoutStore.state.advertisementCreateVisible)
watch(
    () => layoutStore.state.advertisementCreateVisible,
    (newValue) => {
      advertisementCreateVisible.value = newValue
    }
)

const advertisementCreateVisibleSynchronization = () => {
  layoutStore.state.advertisementCreateVisible = false
}

const advertisementBulkDeleteVisible = ref(false)
let idsToDelete: number[]

const handleIdsToDelete = () => {
  idsToDelete = []

  const rows: Advertisement[] = multipleAdvertisementTableRef.value.getSelectionRows()
  rows.forEach(row => {
    idsToDelete.push(row.id)
  })
}

const handleBulkDelete = async (ids: number[]) => {
  const requestData: AdvertisementDeleteRequest = {
    ids: ids
  }
  const res = await advertisementDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  advertisementBulkDeleteVisible.value = false
  layoutStore.state.shouldRefreshAdvertisementTable = true
}

const advertisementListRequest = reactive<AdvertisementListRequest>({
  title: null,
  content: null,
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  advertisementListRequest.title = route.query.title as string || null
  advertisementListRequest.content = route.query.content as string || null
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})

const getAdvertisementTableData = async () => {
  if (advertisementListRequest.title === "") {
    advertisementListRequest.title = null
  }
  if (advertisementListRequest.content === "") {
    advertisementListRequest.content = null
  }

  advertisementListRequest.page = page.value
  advertisementListRequest.page_size = page_size.value

  const table = await advertisementList(advertisementListRequest)

  if (table.code === 0) {
    advertisementTableData.value = table.data.list
    total.value = table.data.total

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        title: advertisementListRequest.title,
        content: advertisementListRequest.content,
        page: advertisementListRequest.page,
        page_size: advertisementListRequest.page_size,
      },
    })
  }
}

watch(() => route.query, (newQuery) => {
  advertisementListRequest.title = newQuery.title as string || null
  advertisementListRequest.content = newQuery.content as string || null
  advertisementListRequest.page = Number(newQuery.page) || 1
  advertisementListRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getAdvertisementTableData()
})

let advertisementInfo: Advertisement
const advertisementDeleteVisible = ref(false)

const advertisementUpdateVisible = ref(layoutStore.state.advertisementUpdateVisible)
watch(
    () => layoutStore.state.advertisementUpdateVisible,
    (newValue) => {
      advertisementUpdateVisible.value = newValue
    }
)

const advertisementUpdateVisibleSynchronization = () => {
  layoutStore.state.advertisementUpdateVisible = false
}

const handleDelete = async (id: number) => {
  let ids: number[] = []
  ids.push(id)

  const requestData: AdvertisementDeleteRequest = {
    ids: ids
  }

  const res = await advertisementDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  advertisementDeleteVisible.value = false
  layoutStore.state.shouldRefreshAdvertisementTable = true
}

watch(() => layoutStore.state.shouldRefreshAdvertisementTable, (newVal) => {
  if (newVal) {
    getAdvertisementTableData()
    layoutStore.state.shouldRefreshAdvertisementTable = false
  }
})

const handleSizeChange = (val: number) => {
  page_size.value = val
  getAdvertisementTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getAdvertisementTableData()
}
</script>

<style scoped lang="scss">
.advertisement-list {
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

  .advertisement-list-request {
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

    .el-image {
      height: 48px;
    }
  }

  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
</style>
