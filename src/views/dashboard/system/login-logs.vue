<template>
  <div class="login-logs">
    <div class="title">
      <el-row>登录日志</el-row>
    </div>

    <div class="user-login-list-request">
      <el-form :inline="true" :model="userLoginListRequest">
        <el-form-item label="uuid">
          <el-input v-model="userLoginListRequest.uuid" placeholder="请输入用户UUID" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getUserLoginTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
        :data="userLoginTableData"
    >
      <el-table-column label="用户" width="80">
        <template #default="scope:{ row: Login, column: any, $index: number }">
          <el-popover width="280">
            <template #reference>
              <el-avatar :src="scope.row.user.avatar"/>
            </template>
            <template #default>
              <user-card :uuid="''"
                         :user-card-info="{uuid:scope.row.user.uuid,username:scope.row.user.username,avatar:scope.row.user.avatar,address:scope.row.user.address,signature:scope.row.user.signature}"/>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="80">
        <template #default="scope:{ row: Login, column: any, $index: number }">
          {{ scope.row.user.username }}
        </template>
      </el-table-column>
      <el-table-column label="登录时间">
        <template #default="scope:{ row: Login, column: any, $index: number }">
          {{ getTime(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="login_method" label="登录方式"/>
      <el-table-column prop="ip" label="IP"/>
      <el-table-column prop="address" label="登录地址"/>
      <el-table-column prop="os" label="操作系统"/>
      <el-table-column prop="device_info" label="设备信息"/>
      <el-table-column prop="browser_info" label="浏览器信息"/>
      <el-table-column prop="status" label="登录状态"/>
    </el-table>

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
import {useRoute, useRouter} from "vue-router";
import {
  type Login,
  userLoginList,
  type UserLoginListRequest,
} from "@/api/user";
import UserCard from "@/components/widgets/UserCard.vue";

const userLoginTableData = ref<Login[]>()
const page = ref(1)
const page_size = ref(10)
const total = ref(0)

const userLoginListRequest = reactive<UserLoginListRequest>({
  uuid: null,
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  userLoginListRequest.uuid = route.query.uuid as string || null
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})

const getUserLoginTableData = async () => {
  if (userLoginListRequest.uuid === "") {
    userLoginListRequest.uuid = null
  }

  userLoginListRequest.page = page.value
  userLoginListRequest.page_size = page_size.value

  const table = await userLoginList(userLoginListRequest)

  if (table.code === 0) {
    userLoginTableData.value = table.data.list
    total.value = table.data.total

    await router.push({
      path: router.currentRoute.value.path,
      query: {
        uuid: userLoginListRequest.uuid,
        page: userLoginListRequest.page,
        page_size: userLoginListRequest.page_size,
      },
    })
  }
}

watch(() => route.query, (newQuery) => {
  userLoginListRequest.uuid = newQuery.uuid as string || null
  userLoginListRequest.page = Number(newQuery.page) || 1
  userLoginListRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getUserLoginTableData()
})

const getTime = (date: Date): string => {
  const time = new Date(date)
  return time.toLocaleString()
}


const handleSizeChange = (val: number) => {
  page_size.value = val
  getUserLoginTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getUserLoginTableData()
}
</script>

<style scoped lang="scss">
.login-logs {
  .title {
    display: flex;

    .el-row {
      font-size: 24px;
    }
  }

  .user-login-list-request {
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
