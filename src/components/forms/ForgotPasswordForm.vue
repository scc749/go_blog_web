<template>
  <div class="forgot-password-form">
    <el-image class="forgot-password-image" src="/image/xiaochun_character_elements_transparent.png" alt=""/>
    <el-form
        ref="forgotPasswordForm"
        :model="forgotPasswordFormData"
        :rules="rules"
        :validate-on-rule-change="false"
        hide-required-asterisk
        @keyup.enter="submitForm"
    >

      <el-form-item label="邮箱" prop="email">
        <el-input
            v-model="forgotPasswordFormData.email"
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
      <el-form-item label="邮箱验证码" prop="verification_code">
        <el-input
            v-model="forgotPasswordFormData.verification_code"
            size="large"
            placeholder="请输入邮箱验证码"
        />
      </el-form-item>
      <el-form-item label="密码" prop="new_password">
        <el-input
            v-model="forgotPasswordFormData.new_password"
            show-password
            size="large"
            type="password"
            placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
            v-model="repeatPassword"
            show-password
            size="large"
            type="password"
            placeholder="请再次输入新密码"
        />
        <el-text v-if="forgotPasswordFormData.new_password!==repeatPassword">两次密码不一致！</el-text>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            size="large"
            @click="submitForm"
        >确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref,} from "vue";
import {forgotPassword, type ForgotPasswordRequest} from "@/api/user";
import {captcha, type EmailRequest, sendEmailVerificationCode} from "@/api/base";
import type {FormInstance, FormRules} from 'element-plus';
import {useLayoutStore} from "@/stores/layout";

const forgotPasswordForm = ref<FormInstance>()

const forgotPasswordFormData = reactive<ForgotPasswordRequest>({
  email: "",
  verification_code: "",
  new_password:"",
})

const repeatPassword = ref('')

const emailRequest = reactive<EmailRequest>({
  email: "",
  captcha: "",
  captcha_id: "",
})

const rules = reactive<FormRules<ForgotPasswordRequest>>({
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
  new_password:[{
    required:true,
    min:8,
    max:20,
    trigger:'change',
    message:'密码的长度应为8~20位'
  }]
})

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
  emailRequest.email = forgotPasswordFormData.email
  const res = await sendEmailVerificationCode(emailRequest)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    emailVerify()
  }
}

const submitForm = async () => {
  const isValid: boolean = await new Promise((resolve) => {
    forgotPasswordForm.value?.validate((valid: boolean) => {
      resolve(valid)
    })
  })

  if (isValid) {
    const res = await forgotPassword(forgotPasswordFormData)

    if (res.code===0) {
      ElMessage.success(res.msg)
      layoutStore.state.forgotPasswordVisible = false
      layoutStore.state.popoverVisible = false
    }
  }
  return false
}
</script>


<style scoped lang="scss">
.forgot-password-form {
  display: flex;

  .forgot-password-image {
    max-width:200px;
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
.forgot-password-form .el-form .captcha .el-input__wrapper {
  height: 40px;
}
</style>
