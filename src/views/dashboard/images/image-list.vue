<template>
  <div class="image-list">
    <div class="title">
      <el-row>图片列表</el-row>
      <el-button-group>
        <el-button type="danger" icon="Delete" @click="imageBulkDeleteVisible = true;handleIdsToDelete()">
          批量删除
        </el-button>

        <el-dialog
            v-model="imageBulkDeleteVisible"
            width="500"
            align-center
            destroy-on-close
        >
          <template #header>
            删除图片
          </template>
          您已选中 [{{ idsToDelete.length }}] 项资源，删除后将无法恢复，是否确认删除？
          <template #footer>
            <el-button type="primary" @click="handleBulkDelete(idsToDelete)">
              确定
            </el-button>
            <el-button @click="imageBulkDeleteVisible = false">取消</el-button>
          </template>
        </el-dialog>
      </el-button-group>
    </div>

    <div class="image-list-request">
      <el-form :inline="true" :model="imageListRequest">
        <el-form-item label="图片名称">
          <el-input v-model="imageListRequest.name" placeholder="请输入图片名称" clearable/>
        </el-form-item>
        <el-form-item label="图片类别">
          <el-select
              v-model="imageListRequest.category"
              placeholder="Select"
              style="width: 200px"
          >
            <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="存储类型">
          <el-select
              v-model="imageListRequest.storage"
              placeholder="Select"
              style="width: 200px"
          >
            <el-option
                v-for="item in storageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getImageTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
        ref="multipleImageTableRef"
        :data="imageTableData"
    >
      <el-table-column type="selection" :selectable="selectable" width="60"/>
      <el-table-column label="图片" width="100">
        <template #default="scope:{ row: Image, column: any, $index: number }">
          <el-image :src="scope.row.url" alt=""/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="320"/>
      <el-table-column prop="url" label="URL" width="340"/>
      <el-table-column prop="category" label="类别"/>
      <el-table-column prop="storage" label="存储"/>
      <el-table-column label="操作">
        <template #default="scope:{ row: Image, column: any, $index: number }">
          <el-button
              v-if="scope.row.category==='未使用'"
              type="danger"
              @click="imageDeleteVisible=true;imageInfo=scope.row"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="imageDeleteVisible"
        width="500"
        align-center
        destroy-on-close
    >
      <template #header>
        删除图片
      </template>
      您已选中 [1] 项资源，删除后将无法恢复，是否确认删除？
      <template #footer>
        <el-button type="primary" @click="handleDelete(imageInfo.id)">
          确定
        </el-button>
        <el-button @click="imageDeleteVisible = false">取消</el-button>
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
import {type Image, imageDelete, type ImageDeleteRequest, imageList, type ImageListRequest} from "@/api/image";


const multipleImageTableRef = ref()
const imageTableData = ref<Image[]>()
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const layoutStore = useLayoutStore()

const selectable = (row: Image) => row.category==='未使用'

const imageBulkDeleteVisible = ref(false)
let idsToDelete: number[]

const handleIdsToDelete = () => {
  idsToDelete = []

  const rows: Image[] = multipleImageTableRef.value.getSelectionRows()
  rows.forEach(row => {
    idsToDelete.push(row.id)
  })
}

const handleBulkDelete = async (ids: number[]) => {
  const requestData: ImageDeleteRequest = {
    ids: ids
  }
  const res = await imageDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  imageBulkDeleteVisible.value = false
  layoutStore.state.shouldRefreshImageTable = true
}

const categoryOptions = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '未使用',
    label: '未使用',
  },
  {
    value: '系统',
    label: '系统',
  },
  {
    value: '背景',
    label: '背景',
  },
  {
    value: '封面',
    label: '封面',
  },
  {
    value: '插图',
    label: '插图',
  },
  {
    value: '广告',
    label: '广告',
  },
  {
    value: '友链',
    label: '友链',
  },
]

const storageOptions = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '本地',
    label: '本地',
  },
  {
    value: '七牛云',
    label: '七牛云',
  },
]

const imageListRequest = reactive<ImageListRequest>({
  name: null,
  category: null,
  storage: null,
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  imageListRequest.name = route.query.name as string || null
  imageListRequest.category = route.query.category as string || null
  imageListRequest.storage = route.query.storage as string || null
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})

const getImageTableData = async () => {
  if (imageListRequest.name === "") {
    imageListRequest.name = null
  }
  if (imageListRequest.category === "") {
    imageListRequest.category = null
  }
  if (imageListRequest.storage === "") {
    imageListRequest.storage = null
  }

  imageListRequest.page = page.value
  imageListRequest.page_size = page_size.value

  const table = await imageList(imageListRequest)

  if (table.code === 0) {
    imageTableData.value = table.data.list
    total.value = table.data.total

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        title: imageListRequest.name,
        content: imageListRequest.category,
        storage: imageListRequest.storage,
        page: imageListRequest.page,
        page_size: imageListRequest.page_size,
      },
    })
  }
}

watch(() => route.query, (newQuery) => {
  imageListRequest.name = newQuery.name as string || null
  imageListRequest.category = newQuery.category as string || null
  imageListRequest.storage = newQuery.storage as string || null
  imageListRequest.page = Number(newQuery.page) || 1
  imageListRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getImageTableData()
})

let imageInfo: Image
const imageDeleteVisible = ref(false)

const handleDelete = async (id: number) => {
  let ids: number[] = []
  ids.push(id)

  const requestData: ImageDeleteRequest = {
    ids: ids
  }

  const res = await imageDelete(requestData)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  imageDeleteVisible.value = false
  layoutStore.state.shouldRefreshImageTable = true
}

watch(() => layoutStore.state.shouldRefreshImageTable, (newVal) => {
  if (newVal) {
    getImageTableData()
    layoutStore.state.shouldRefreshImageTable = false
  }
})

const handleSizeChange = (val: number) => {
  page_size.value = val
  getImageTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getImageTableData()
}
</script>

<style scoped lang="scss">
.image-list {
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

  .image-list-request {
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
