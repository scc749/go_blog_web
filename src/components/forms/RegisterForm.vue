<template>
  <div class="register-form">
    <el-image class="register-image" src="/image/xiaochun_character_elements_transparent.png" alt=""/>
    <el-form
        ref="registerForm"
        :model="registerFormData"
        :rules="rules"
        :validate-on-rule-change="false"
        hide-required-asterisk
        @keyup.enter="submitForm"
    >

      <el-form-item label="用户名" prop="username">
        <el-input
            v-model="registerFormData.username"
            size="large"
            placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            v-model="registerFormData.password"
            show-password
            size="large"
            type="password"
            placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
            v-model="repeatPassword"
            show-password
            size="large"
            type="password"
            placeholder="请再次输入密码"
        />
        <el-text v-if="registerFormData.password!==repeatPassword">两次密码不一致！</el-text>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
            v-model="registerFormData.email"
            size="large"
            placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <div class="captcha">
          <el-input
              v-model="emailRequest.captcha"
              placeholder="请输入图片验证码"
              size="large"
              maxlength="6"
              minlength="6"
          />
          <el-image :src="picPath" alt="" @click="emailVerify"/>
          <el-button @click="sendCode">发送验证码</el-button>
        </div>
      </el-form-item>
      <el-form-item label="邮箱验证码" prop="email">
        <el-input
            v-model="registerFormData.verification_code"
            size="large"
            placeholder="请输入邮箱验证码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            size="large"
            @click="submitForm"
        >注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import type {RegisterRequest} from "@/api/user";
import {useUserStore} from "@/stores/user";
import {captcha, type EmailRequest, sendEmailVerificationCode} from "@/api/base";
import type {FormInstance, FormRules} from 'element-plus';
import {useLayoutStore} from "@/stores/layout";

const registerForm = ref<FormInstance>()

const registerFormData = reactive<RegisterRequest>({
  username: "",
  password: "",
  email: "",
  verification_code: "",
})

const repeatPassword = ref('')

const emailRequest = reactive<EmailRequest>({
  email: "",
  captcha: "",
  captcha_id: "",
})


const rules = reactive<FormRules<RegisterRequest>>({
  username:[{
    required:true,
    max:20,
    trigger:'blur',
    message:'用户名长度不应大于20位'
  }],
  password:[{
    required:true,
    min:8,
    max:20,
    trigger:'change',
    message:'密码的长度应为8~20位'
  }],
  email: [{
    required: true,
    type:'email',
    trigger: 'blur',
    message: '请输入正确的邮箱格式'
  }],
  verification_code: [{
    required: true,
    len: 6,
    trigger: 'blur',
    message: '请输入6位的验证码'
  }],
})

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const picPath = ref('')

const emailVerify = () => {
  captcha().then(async (res) => {
    picPath.value = res.data.pic_path
    emailRequest.captcha_id = res.data.captcha_id
  })
}

emailVerify()

const sendCode = async () => {
  emailRequest.email = registerFormData.email
  const res = await sendEmailVerificationCode(emailRequest)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    emailVerify()
  }
}

const submitForm = async () => {
  const isValid: boolean = await new Promise((resolve) => {
    registerForm.value?.validate((valid: boolean) => {
      resolve(valid)
    })
  })

  if (isValid) {
    const flag = await userStore.registerIn(registerFormData)

    if (flag) {
      layoutStore.state.registerVisible = false
      layoutStore.state.popoverVisible = false
    }
  }
  return false
}
</script>


<style scoped lang="scss">
.register-form {
  display: flex;

  .register-image {
    max-width: 240px;
    width: 100%;
  }

  .el-form {
    .captcha {
      display: flex;
    }
    .el-text{
      color: red;
    }
  }
}
</style>

<style lang="scss">
.register-form .el-form .captcha .el-input__wrapper {
  height: 40px;
}
</style>
