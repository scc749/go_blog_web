<template>
  <div class="user-list">
    <div class="title">
      <el-row>用户列表</el-row>
    </div>

    <div class="user-list-request">
      <el-form :inline="true" :model="userListRequest">
        <el-form-item label="uuid">
          <el-input v-model="userListRequest.uuid" placeholder="请输入用户UUID" clearable/>
        </el-form-item>
        <el-form-item label="注册来源">
          <el-select
              v-model="userListRequest.register"
              placeholder="Select"
              style="width: 200px"
          >
            <el-option
                v-for="item in registerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getUserTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
        :data="userTableData"
    >
      <el-table-column label="头像">
        <template #default="scope:{ row: User, column: any, $index: number }">
          <el-avatar :src="scope.row.avatar" alt=""/>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="uuid" label="UUID" width="320px"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column label="注册时间" width="250px">
        <template #default="scope:{ row: User, column: any, $index: number }">
          {{ getTime(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template #default="scope:{ row: User, column: any, $index: number }">
          {{ scope.row.role_id === 2 ? "管理员" : "普通用户" }}
        </template>
      </el-table-column>
      <el-table-column prop="register" label="注册来源"/>
      <el-table-column label="操作">
        <template #default="scope:{ row: User, column: any, $index: number }">
          <el-button
              v-if="scope.row.role_id===1"
              type="warning"
              @click="userFreezeVisible=true;userInfo=scope.row"
          >
            {{ scope.row.freeze === false ? "冻结" : "解冻" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="userFreezeVisible"
        width="500"
        align-center
        destroy-on-close
    >
      <template #header>
        冻结/解冻用户
      </template>
      是否{{ userInfo.freeze === false ? "冻结" : "解冻" }}该用户：{{ userInfo.username }}
      <template #footer>
        <el-button type="primary" @click="handleFreeze(userInfo.id,userInfo.freeze)">
          确定
        </el-button>
        <el-button @click="userFreezeVisible = false">取消</el-button>
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
import {type User, userFreeze, userList, type UserListRequest, type UserOperation, userUnfreeze} from "@/api/user";

const userTableData = ref<User[]>()
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const layoutStore = useLayoutStore()

const registerOptions=[
  {
    value: '',
    label: '全部',
  },
  {
    value: 'QQ',
    label: 'QQ',
  },
  {
    value: '邮箱',
    label: '邮箱',
  },
]

const userListRequest = reactive<UserListRequest>({
  uuid: null,
  register:null,
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  userListRequest.uuid = route.query.uuid as string || null
  userListRequest.register = route.query.register as string || null
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})

const getTime = (date: Date): string => {
  const time = new Date(date)
  return time.toLocaleString()
}

const getUserTableData = async () => {
  if (userListRequest.uuid === "") {
    userListRequest.uuid = null
  }
  if (userListRequest.register === "") {
    userListRequest.register = null
  }

  userListRequest.page = page.value
  userListRequest.page_size = page_size.value

  const table = await userList(userListRequest)

  if (table.code === 0) {
    userTableData.value = table.data.list
    total.value = table.data.total

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        uuid: userListRequest.uuid,
        register: userListRequest.register,
        page: userListRequest.page,
        page_size: userListRequest.page_size,
      },
    })
  }
}

watch(() => route.query, (newQuery) => {
  userListRequest.uuid = newQuery.uuid as string || null
  userListRequest.register = newQuery.register as string || null
  userListRequest.page = Number(newQuery.page) || 1
  userListRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getUserTableData()
})

let userInfo: User

const userFreezeVisible = ref(false)

const handleFreeze = async (id: number, freeze: boolean) => {
  const userOperationRequest: UserOperation = {
    id: id,
  }
  if (freeze) {
    const res = await userUnfreeze(userOperationRequest)
    if (res.code === 0) {
      ElMessage.success(res.msg)
    }
    userFreezeVisible.value = false
    layoutStore.state.shouldRefreshUserTable = true
  } else {
    const res = await userFreeze(userOperationRequest)
    if (res.code === 0) {
      ElMessage.success(res.msg)
    }
    userFreezeVisible.value = false
    layoutStore.state.shouldRefreshUserTable = true
  }
}

watch(() => layoutStore.state.shouldRefreshUserTable, (newVal) => {
  if (newVal) {
    getUserTableData()
    layoutStore.state.shouldRefreshUserTable = false
  }
})

const handleSizeChange = (val: number) => {
  page_size.value = val
  getUserTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getUserTableData()
}
</script>

<style scoped lang="scss">
.user-list {
  .title {
    display: flex;

    .el-row {
      font-size: 24px;
    }
  }

  .user-list-request {
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
