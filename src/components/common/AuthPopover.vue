<template>
  <div class="auth-popover">
    <el-popover v-if="isLoggedIn" width="280" trigger="click">
      <template #reference>
        <el-avatar :size="36" :src="userStore.state.userInfo.avatar"/>
      </template>
      <template #default>
        <div class="title">
          <el-row>欢迎回来，{{ userStore.state.userInfo.username }}！</el-row>
        </div>
        <div class="user-info">
          <el-avatar :size="50" :src="userStore.state.userInfo.avatar"/>
          <el-row>{{ userStore.state.userInfo.username }}</el-row>
          <el-row>{{ userStore.state.userInfo.address }}</el-row>
        </div>
        <el-row class="uuid">uuid：{{ userStore.state.userInfo.uuid }}</el-row>
        <div class="container">
          <el-row>签名：{{ userStore.state.userInfo.signature }}</el-row>
          <div class="action-button">
            <el-button @click="userStore.loginOut()">退出登录</el-button>
            <el-button @click="goIndexOrToDashboard">{{ label }}</el-button>
          </div>
        </div>
      </template>
    </el-popover>

    <el-popover v-else :visible="popoverVisible" width="280">
      <template #reference>
        <el-avatar :size="36" :icon="User" src=""
                   @click="layoutStore.state.popoverVisible = !layoutStore.state.popoverVisible"/>
      </template>
      <template #default>
        <div class="default" v-click-outside="onClickOutside">
          <div class="title">
            <el-row>请登录以获取完整的功能体验。</el-row>
          </div>
          <div class="auth-button">
            <div class="button-item">
              <el-button class="login" icon="User" @click="layoutStore.state.loginVisible = true"/>
              登录
              <el-dialog
                  v-model="loginVisible"
                  width="500"
                  destroy-on-close
                  align-center
                  :before-close="loginVisibleSynchronization"
              >
                <template #header>
                  登录
                </template>
                <login-form/>
                <template #footer>

                </template>
              </el-dialog>
            </div>

            <div class="button-item">
              <el-button class="register" icon="Edit" @click="layoutStore.state.registerVisible = true"/>
              注册
              <el-dialog
                  v-model="registerVisible"
                  width="640"
                  destroy-on-close
                  align-center
                  :before-close="registerVisibleSynchronization"
              >
                <template #header>
                  注册
                </template>
                <register-form/>
                <template #footer>

                </template>
              </el-dialog>
            </div>

            <div class="button-item">
              <el-button class="forgot-password" icon="Unlock" @click="layoutStore.state.forgotPasswordVisible = true"/>
              找回密码
              <el-dialog
                  v-model="forgotPasswordVisible"
                  width="570"
                  destroy-on-close
                  align-center
                  :before-close="forgotPasswordVisibleSynchronization"
              >
                <template #header>
                  找回密码
                </template>
                <forgot-password-form/>
                <template #footer>

                </template>
              </el-dialog>
            </div>
          </div>
          <div class="container">
            <el-divider>快速登录</el-divider>
            <div class="oauth-login">
              <div class="login-item">
                <el-image class="qq-login" src="/image/qq_symbol.jpg" alt="" @click="qqLogin"/>
                QQ登录
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import {User} from "@element-plus/icons-vue";
import {computed, ref, watch} from 'vue'
import LoginForm from "@/components/forms/LoginForm.vue";
import {useLayoutStore} from "@/stores/layout";
import {ClickOutside as vClickOutside} from 'element-plus'
import {useUserStore} from "@/stores/user";
import router from "@/router";
import {useRoute} from "vue-router";
import RegisterForm from "@/components/forms/RegisterForm.vue";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm.vue";
import {qqLoginURL} from "@/api/base";


const userStore = useUserStore()
const route = useRoute()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const isInDashboard = route.matched.some(record => record.name === 'dashboard')
const label = isInDashboard ? '返回首页' : '进入后台'
const goIndexOrToDashboard = (() => {
  if (isInDashboard) {
    router.push({name: 'index'})
  } else {
    router.push({name: 'home'})
  }
})

const layoutStore = useLayoutStore()

const popoverVisible = ref(layoutStore.state.popoverVisible)
watch(
    () => layoutStore.state.popoverVisible,
    (newValue) => {
      popoverVisible.value = newValue;
    }
)

const onClickOutside = () => {
  layoutStore.state.popoverVisible = false
}

const loginVisible = ref(layoutStore.state.loginVisible)
watch(
    () => layoutStore.state.loginVisible,
    (newValue) => {
      loginVisible.value = newValue
    }
)

const loginVisibleSynchronization = () => {
  layoutStore.state.loginVisible = false
}

const registerVisible = ref(layoutStore.state.registerVisible)
watch(
    () => layoutStore.state.registerVisible,
    (newValue) => {
      registerVisible.value = newValue
    }
)

const registerVisibleSynchronization = () => {
  layoutStore.state.registerVisible = false
}

const forgotPasswordVisible = ref(layoutStore.state.forgotPasswordVisible)
watch(
    () => layoutStore.state.forgotPasswordVisible,
    (newValue) => {
      forgotPasswordVisible.value = newValue
    }
)

const forgotPasswordVisibleSynchronization = () => {
  layoutStore.state.forgotPasswordVisible = false
}

const qqLogin = async () => {
  const res = await qqLoginURL()
  if (res.code === 0) {
    window.location.href = res.data
  }
}
</script>

<style scoped lang="scss">
.auth-popover {
  --el-text-color-disabled: transparent;

  .el-avatar--icon {
    font-size: 24px;
  }
}


.el-popover.el-popper {
  .title {
    display: flex;
    height: 60px;

    .el-row {
      margin: auto auto;
    }
  }

  .user-info {
    text-align: center;

    .el-row {
      display: flex;
      justify-content: center;
      margin: 5px;
    }
  }

  .uuid {
    margin: 10px 20px;
  }

  .container {
    background-color: white;

    .el-row {
      padding: 20px;
    }

    .action-button {
      display: flex;
      justify-content: center;

      .el-button {
        border: none;
        background-color: transparent;
        margin-bottom: 10px;
      }
    }
  }


}

.el-popover.el-popper {
  .default {
    .title {
      display: flex;
      height: 60px;

      .el-row {
        margin: auto auto;
      }
    }

    .auth-button {
      display: flex;
      justify-content: center;

      .button-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;

        .el-button {
          border: none;
          --el-font-size-base: 32px;
          height: 62px;
          background-color: transparent;
        }
      }
    }

    .container {
      background-color: white;

      .el-divider {
        --el-bg-color: transparent;
      }

      .oauth-login {
        display: flex;
        justify-content: center;

        .login-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          margin-top: auto;

          .el-image {
            height: 32px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-popover.el-popper {
  background-color: rgba(255, 255, 255, 0.75);
  padding: 0;

  .el-popper__arrow:before {
    background-color: transparent;
  }
}
</style>
