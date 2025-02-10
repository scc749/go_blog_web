<template>
  <div class="login-form">
    <el-image class="login-image" src="/image/xiaochun_character_elements_transparent.png" alt=""/>
    <el-form
        ref="loginForm"
        :model="loginFormData"
        :rules="rules"
        :validate-on-rule-change="false"
        hide-required-asterisk
        @keyup.enter="submitForm"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
            v-model="loginFormData.email"
            size="large"
            placeholder="请输入邮箱"
            suffix-icon="user"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            v-model="loginFormData.password"
            show-password
            size="large"
            type="password"
            placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <div class="captcha">
          <el-input
              v-model="loginFormData.captcha"
              placeholder="请输入验证码"
              size="large"
          />
          <el-image :src="picPath" alt="" @click="loginVerify"/>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            size="large"
            @click="submitForm"
        >登 录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import type {LoginRequest} from "@/api/user";
import {useUserStore} from "@/stores/user";
import {captcha} from "@/api/base";
import type {FormInstance, FormRules} from 'element-plus';
import {useLayoutStore} from "@/stores/layout";

const loginForm = ref<FormInstance>()

const loginFormData = reactive<LoginRequest>({
  email: "",
  password: "",
  captcha: "",
  captcha_id: "",
})

const rules = reactive<FormRules<LoginRequest>>({
  email: [{
    required: true,
    type: 'email',
    trigger: 'blur',
    message: '请输入正确的邮箱格式'
  }],
  password: [{
    required: true,
    min: 8,
    max: 20,
    trigger: 'change',
    message: '密码的长度应为8~20位'
  }],
  captcha: [{
    required: true,
    len: 6,
    trigger: 'blur',
    message: '请输入6位的验证码'
  }],
})

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const picPath = ref('')

const loginVerify = () => {
  captcha().then(async (res) => {
    picPath.value = res.data.pic_path
    loginFormData.captcha_id = res.data.captcha_id
  })
}

loginVerify()

const submitForm = async () => {
  const isValid: boolean = await new Promise((resolve) => {
    loginForm.value?.validate((valid: boolean) => {
      resolve(valid)
    })
  })

  if (isValid) {
    const flag = await userStore.loginIn(loginFormData)

    if (!flag) {
      loginVerify()
    } else {
      layoutStore.state.loginVisible = false
      layoutStore.state.popoverVisible = false
    }
  }
  loginVerify()
  return false
}
</script>


<style scoped lang="scss">
.login-form {
  display: flex;

  .login-image {
    max-width: 160px;
    width: 100%;
  }

  .el-form {
    .captcha {
      display: flex;
    }
  }
}
</style>

<style lang="scss">
.login-form .el-form .captcha .el-input__wrapper {
  height: 40px;
}
</style>
