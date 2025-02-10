<template>
  <div class="login">
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import service, {type ApiResponse} from "@/utils/request";
import type {LoginResponse} from "@/api/user";
import {useUserStore} from "@/stores/user";

ElMessage.info('登录中...')

const route = useRoute();
const router = useRouter();

const flag = route.query.flag as string;
const code = route.query.code as string;

interface QQLoginRequest {
  flag: string;
  code: string;
}
const qqLogin = (data: QQLoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return service({
    url: '/user/login',
    method: 'post',
    params: data
  });
}

const loginIn = async () => {
  const qqLoginRequest: QQLoginRequest = {
    flag: flag,
    code: code,
  }
  const res = await qqLogin(qqLoginRequest)
  if (res.code === 0) {
    const userStore = useUserStore()
    userStore.state.userInfo = res.data.user
    userStore.state.accessToken = res.data.access_token
    userStore.state.isUserLoggedInBefore = true
    router.push({name: 'index'}).then(() => {
      ElMessage.success(res.msg)
    })
  } else {
    router.push({name: 'index'}).then()
  }
}

loginIn()
</script>
