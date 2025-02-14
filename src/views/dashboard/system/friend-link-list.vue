<template>
  <div class="friend-link-list">
    <div class="title">
      <el-row>友链列表</el-row>
      <el-button-group>
        <el-button type="success" icon="Plus" @click="layoutStore.state.friendLinkCreateVisible = true">
          新建友链
        </el-button>

        <el-dialog
            v-model="friendLinkCreateVisible"
            width="500"
            align-center
            destroy-on-close
            :before-close="friendLinkCreateVisibleSynchronization"
        >
          <template #header>
            新建友链
          </template>
          <friend-link-create-form/>
          <template #footer>
          </template>
        </el-dialog>

        <el-button type="danger" icon="Delete" @click="friendLinkBulkDeleteVisible = true;handleIdsToDelete()">
          批量删除
        </el-button>

        <el-dialog
            v-model="friendLinkBulkDeleteVisible"
            width="500"
            align-center
            destroy-on-close
        >
          <template #header>
            删除友链
          </template>
          您已选中 [{{ idsToDelete.length }}] 项资源，删除后将无法恢复，是否确认删除？
          <template #footer>
            <el-button type="primary" @click="handleBulkDelete(idsToDelete)">
              确定
            </el-button>
            <el-button @click="friendLinkBulkDeleteVisible = false">取消</el-button>
          </template>
        </el-dialog>
      </el-button-group>
    </div>

    <div class="friend-link-list-request">
      <el-form :inline="true" :model="friendLinkListRequest">
        <el-form-item label="友链名称">
          <el-input v-model="friendLinkListRequest.name" placeholder="请输入友链名称" clearable/>
        </el-form-item>
        <el-form-item label="友链描述">
          <el-input v-model="friendLinkListRequest.description" placeholder="请输入友链描述" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getFriendLinkTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
        ref="multipleFriendLinkTableRef"
        :data="friendLinkTableData"
    >
      <el-table-column type="selection" width="60"/>
      <el-table-column label="Logo">
        <template #default="scope:{ row: any, column: any, $index: number }">
          <el-image :src="scope.row.logo" alt=""/>
        </template>
      </el-table-column>
      <el-table-column prop="link" label="链接"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column label="操作">
        <template #default="scope:{ row: any, column: any, $index: number }">
          <el-button
              type="warning"
              @click="layoutStore.state.friendLinkUpdateVisible=true;friendLinkInfo=scope.row"
          >
            更新
          </el-button>
          <el-button
              type="danger"
              @click="friendLinkDeleteVisible=true;friendLinkInfo=scope.row"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="friendLinkUpdateVisible"
        width="500"
        align-center
        destroy-on-close
        :before-close="friendLinkUpdateVisibleSynchronization"
    >
      <template #header>
        更新友链
      </template>
      <friend-link-update-form :friendLink=friendLinkInfo />
      <template #footer>
      </template>
    </el-dialog>

    <el-dialog
        v-model="friendLinkDeleteVisible"
        width="500"
        align-center
        destroy-on-close
    >
      <template #header>
        删除友链
      </template>
      您已选中 [1] 项资源，删除后将无法恢复，是否确认删除？
      <template #footer>
        <el-button type="primary" @click="handleDelete(friendLinkInfo.id)">
          确定
        </el-button>
        <el-button @click="friendLinkDeleteVisible = false">取消</el-button>
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
import {nextTick, onMounted, reactive, ref, watch} from 'vue'
import {
  type FriendLinkListRequest,
  type FriendLink,
  friendLinkDelete,
  type FriendLinkDeleteRequest
} from "@/api/friend-link";
import {friendLinkList} from "@/api/friend-link";
import FriendLinkCreateForm from "@/components/forms/FriendLinkCreateForm.vue";
import {useLayoutStore} from "@/stores/layout";
import FriendLinkUpdateForm from "@/components/forms/FriendLinkUpdateForm.vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";


const layoutStore = useLayoutStore()

/*
* 这里写成 const friendLinkCreateVisible = computed(() => layoutStore.state.friendLinkCreateVisible)
* 就会导致，上面不能直接赋值 friendLinkCreateVisible = false
* 写成 const friendLinkCreateVisible = ref(layoutStore.state.friendLinkCreateVisible)
* 就会导致，不能根据 layoutStore.state.friendLinkCreateVisible 自动变化
* const friendLinkCreateVisible = ref(computed(() => layoutStore.state.friendLinkCreateVisible)) 不被允许的
* */
const friendLinkCreateVisible = ref(layoutStore.state.friendLinkCreateVisible);
watch(
    () => layoutStore.state.friendLinkCreateVisible,
    (newValue) => {
      friendLinkCreateVisible.value = newValue;
    }
);

const friendLinkBulkDeleteVisible = ref(false)
let idsToDelete: number[]

const friendLinkCreateVisibleSynchronization = () => {
  layoutStore.state.friendLinkCreateVisible = false
}

const page = ref(1)
const page_size = ref(10)
const total = ref(0)
const friendLinkTableData = ref<FriendLink[]>()


const friendLinkListRequest = reactive<FriendLinkListRequest>({
  name: null,
  description: null,
  page: 1,
  page_size: 10,
})

const route = useRoute();
const router = useRouter();

onMounted(() => {
  friendLinkListRequest.name = route.query.name as string || null;
  friendLinkListRequest.description = route.query.description as string || null;
  page.value = Number(route.query.page) || 1;
  page_size.value = Number(route.query.page_size) || 10;
});

const getFriendLinkTableData = async () => {
  if (friendLinkListRequest.name === "") {
    friendLinkListRequest.name = null;
  }
  if (friendLinkListRequest.description === "") {
    friendLinkListRequest.description = null;
  }

  friendLinkListRequest.page = page.value;
  friendLinkListRequest.page_size = page_size.value;

  const table = await friendLinkList(friendLinkListRequest);

  if (table.code === 0) {
    friendLinkTableData.value = table.data.list;
    total.value = table.data.total;

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        name: friendLinkListRequest.name,
        description: friendLinkListRequest.description,
        page: friendLinkListRequest.page,
        page_size: friendLinkListRequest.page_size,
      },
    })
  }
}

nextTick(() => {
  getFriendLinkTableData();
});

const handleSizeChange = (val: number) => {
  page_size.value = val
  getFriendLinkTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getFriendLinkTableData()
}

const friendLinkUpdateVisible = ref(layoutStore.state.friendLinkUpdateVisible);
watch(
    () => layoutStore.state.friendLinkUpdateVisible,
    (newValue) => {
      friendLinkUpdateVisible.value = newValue;
    }
);

const friendLinkUpdateVisibleSynchronization = () => {
  layoutStore.state.friendLinkUpdateVisible = false
}

const friendLinkDeleteVisible = ref(false)

const handleDelete = async (id: number) => {
  let ids: number[] = []
  ids.push(id)

  const requestData: FriendLinkDeleteRequest = {
    ids: ids
  };

  const res = await friendLinkDelete(requestData);
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  friendLinkDeleteVisible.value = false
  layoutStore.state.shouldRefreshFriendLinkTable = true
}

const multipleFriendLinkTableRef = ref()

const handleIdsToDelete = () => {
  idsToDelete = []

  const rows: FriendLink[] = multipleFriendLinkTableRef.value.getSelectionRows()
  rows.forEach(row => {
    idsToDelete.push(row.id)
  })
}

const handleBulkDelete = async (ids: number[]) => {
  const requestData: FriendLinkDeleteRequest = {
    ids: ids
  };


  const res = await friendLinkDelete(requestData);
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  friendLinkBulkDeleteVisible.value = false
  layoutStore.state.shouldRefreshFriendLinkTable = true
}

watch(() => layoutStore.state.shouldRefreshFriendLinkTable, (newVal) => {
  if (newVal) {
    getFriendLinkTableData();
    layoutStore.state.shouldRefreshFriendLinkTable = false;
  }
});

let friendLinkInfo: FriendLink


watch(() => route.query, (newQuery) => {
  friendLinkListRequest.name = newQuery.name as string || null;
  friendLinkListRequest.description = newQuery.description as string || null;
  friendLinkListRequest.page = Number(newQuery.page) || 1;
  friendLinkListRequest.page_size = Number(newQuery.page_size) || 10;
}, {immediate: true});
</script>

<style scoped lang="scss">
.friend-link-list {
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

  .friend-link-list-request {
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
