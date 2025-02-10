<template>
  <div class="site-config">
    <el-col :span="12">
      <div class="website-info">
        <div class="title">
          <el-row>网站信息</el-row>
        </div>
        <div class="content">
          <el-form
              :model="websiteInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="Logo图片">
              <el-upload
                  :action="`${path}/image/upload`"
                  drag
                  with-credentials
                  :headers="{'x-access-token':userStore.state.accessToken}"
                  :show-file-list="false"
                  :on-success="handleLogoSuccess"
                  :on-error="handleLogoSuccess"
                  name="image"
              >

                <el-image v-if="websiteInfo.logo" :src="websiteInfo.logo"
                          alt=""/>
                <div v-else class="upload-content">
                  <div class="container">
                    <component is="UploadFilled" class="upload-filled"></component>
                    <div class="el-upload__text">
                      Drop file here or <em>click to upload</em>
                    </div>
                  </div>
                </div>

                <template #tip>
                  <div class="clear-button">
                    <el-button v-if="websiteInfo.logo" icon="Delete" type="danger" @click="clearLogo"/>
                  </div>
                  <div class="el-upload__tip">
                    jpg/png/jpeg/ico/tiff/gif/svg/webp files with a size less than 20MB.
                  </div>
                </template>
              </el-upload>

              <el-input
                  v-model="websiteInfo.logo"
                  size="large"
                  disabled
              />
            </el-form-item>
            <el-form-item label="FullLogo图片">
              <el-upload
                  :action="`${path}/image/upload`"
                  drag
                  with-credentials
                  :headers="{'x-access-token':userStore.state.accessToken}"
                  :show-file-list="false"
                  :on-success="handleFullLogoSuccess"
                  :on-error="handleFullLogoSuccess"
                  name="image"
              >

                <el-image v-if="websiteInfo.full_logo" :src="websiteInfo.full_logo"
                          alt=""/>

                <div v-else class="upload-content">
                  <div class="container">
                    <component is="UploadFilled" class="upload-filled"></component>
                    <div class="el-upload__text">
                      Drop file here or <em>click to upload</em>
                    </div>
                  </div>
                </div>

                <template #tip>
                  <div class="clear-button">
                    <el-button v-if="websiteInfo.full_logo" icon="Delete" type="danger" @click="clearFullLogo"/>
                  </div>
                  <div class="el-upload__tip">
                    jpg/png/jpeg/ico/tiff/gif/svg/webp files with a size less than 20MB.
                  </div>
                </template>
              </el-upload>

              <el-input
                  v-model="websiteInfo.full_logo"
                  size="large"
                  disabled
              />
            </el-form-item>
            <el-form-item label="网站标题">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.title"/>
            </el-form-item>
            <el-form-item label="网站标语">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.slogan"/>
            </el-form-item>
            <el-form-item label="英文标语">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.slogan_en"/>
            </el-form-item>
            <el-form-item label="网站描述">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.description" type="textarea" :rows="4"/>
            </el-form-item>
            <el-form-item label="网站版本">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.version"/>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.created_at"/>
            </el-form-item>
            <el-form-item label="ICP备案">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.icp_filing"/>
            </el-form-item>
            <el-form-item label="公安备案">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.public_security_filing"/>
            </el-form-item>
            <el-form-item label="bilibili链接">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.bilibili_url"/>
            </el-form-item>
            <el-form-item label="gitee链接">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.gitee_url"/>
            </el-form-item>
            <el-form-item label="github链接">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.github_url"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="personal-info">
        <div class="title">
          <el-row>个人信息</el-row>
        </div>
        <div class="content">
          <el-form
              :model="websiteInfo"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="昵称">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.name"/>
            </el-form-item>
            <el-form-item label="职业">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.job"/>
            </el-form-item>
            <el-form-item label="地址">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.address"/>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input @change="updateWebsiteInfo" v-model="websiteInfo.email"/>
            </el-form-item>
            <el-form-item label="QQ图片">
              <el-upload
                  :action="`${path}/image/upload`"
                  drag
                  with-credentials
                  :headers="{'x-access-token':userStore.state.accessToken}"
                  :show-file-list="false"
                  :on-success="handleQQImageSuccess"
                  :on-error="handleQQImageSuccess"
                  name="image"
              >

                <el-image v-if="websiteInfo.qq_image" :src="websiteInfo.qq_image"
                          alt=""/>

                <div v-else class="upload-content">
                  <div class="container">
                    <component is="UploadFilled" class="upload-filled"></component>
                    <div class="el-upload__text">
                      Drop file here or <em>click to upload</em>
                    </div>
                  </div>
                </div>

                <template #tip>
                  <div class="clear-button">
                    <el-button v-if="websiteInfo.qq_image" icon="Delete" type="danger" @click="clearQQImageLogo"/>
                  </div>
                  <div class="el-upload__tip">
                    jpg/png/jpeg/ico/tiff/gif/svg/webp files with a size less than 20MB.
                  </div>
                </template>
              </el-upload>

              <el-input
                  v-model="websiteInfo.qq_image"
                  size="large"
                  disabled
              />
            </el-form-item>
            <el-form-item label="微信图片">
              <el-upload
                  :action="`${path}/image/upload`"
                  drag
                  with-credentials
                  :headers="{'x-access-token':userStore.state.accessToken}"
                  :show-file-list="false"
                  :on-success="handleWechatImageSuccess"
                  :on-error="handleWechatImageSuccess"
                  name="image"
              >

                <el-image v-if="websiteInfo.wechat_image" :src="websiteInfo.wechat_image"
                          alt=""/>

                <div v-else class="upload-content">
                  <div class="container">
                    <component is="UploadFilled" class="upload-filled"></component>
                    <div class="el-upload__text">
                      Drop file here or <em>click to upload</em>
                    </div>
                  </div>
                </div>

                <template #tip>
                  <div class="clear-button">
                    <el-button v-if="websiteInfo.wechat_image" icon="Delete" type="danger"
                               @click="clearWechatImageLogo"/>
                  </div>
                  <div class="el-upload__tip">
                    jpg/png/jpeg/ico/tiff/gif/svg/webp files with a size less than 20MB.
                  </div>
                </template>
              </el-upload>

              <el-input
                  v-model="websiteInfo.wechat_image"
                  size="large"
                  disabled
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="footer-link">
        <div class="title">
          <el-row>页脚链接</el-row>
        </div>
        <div class="content">
          <el-form
              :model="footerLinkList"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <template v-for="item in footerLinkList">
              <el-form-item :label="item.title">
                <el-input
                    v-model="item.link"
                    size="large"
                    disabled
                />
              </el-form-item>
              <div class="delete-button">
                <el-button icon="Delete" type="danger" @click="handleDeleteFooterLink(item)"/>
              </div>
            </template>
          </el-form>
          <div class="button-group">
            <el-button v-if="!isShow" type="success" @click="isShow=true">新建</el-button>
            <el-button v-if="isShow" type="primary" @click="isShow=false;handleCreateFooterLink(footerLink)">确定</el-button>
            <el-button v-if="isShow" @click="isShow=false">取消</el-button>
          </div>
          <el-form
              v-if="isShow"
              :model="footerLink"
              :validate-on-rule-change="false"
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="标题">
              <el-input
                  v-model="footerLink.title"
                  size="large"
              />
            </el-form-item>
            <el-form-item label="链接">
              <el-input
                  v-model="footerLink.link"
                  size="large"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="carousel-info">
        <div class="title">
          <el-row>首页图片</el-row>
        </div>
        <div class="content">
          <template v-for="item in carouselList">
            <div class="carousel-item">
              <el-image :src="item" alt=""/>
              <el-button icon="Delete" type="danger" @click="cancelCarousel(item)"/>
            </div>
          </template>

          <el-form
              label-width="auto"
              style="max-width: 400px"
          >
            <el-form-item label="图片上传">
              <el-upload
                  :action="`${path}/image/upload`"
                  drag
                  with-credentials
                  :headers="{'x-access-token':userStore.state.accessToken}"
                  :show-file-list="false"
                  :on-success="handleCarouselSuccess"
                  :on-error="handleCarouselSuccess"
                  name="image"
              >

                <div class="upload-content">
                  <div class="container">
                    <component is="UploadFilled" class="upload-filled"></component>
                    <div class="el-upload__text">
                      Drop file here or <em>click to upload</em>
                    </div>
                  </div>
                </div>

                <template #tip>
                  <div class="el-upload__tip">
                    jpg/png/jpeg/ico/tiff/gif/svg/webp files with a size less than 20MB.
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {getWebsite, updateWebsite, type Website} from "@/api/config";
import {useUserStore} from "@/stores/user";
import type {ApiResponse} from "@/utils/request";
import type {ImageUploadResponse} from "@/api/image";
import {ElMessage} from "element-plus";
import {useWebsiteStore} from "@/stores/website";
import {
  type FooterLink,
  websiteAddCarousel,
  websiteCancelCarousel,
  websiteCarousel,
  type WebsiteCarouselOperation, websiteCreateFooterLink, websiteDeleteFooterLink, websiteFooterLink
} from "@/api/website";

const path = ref(import.meta.env.VITE_BASE_API)
const userStore = useUserStore()

const websiteInfo = ref<Website>({
  logo: '',
  full_logo: '',
  title: '',
  slogan: '',
  slogan_en: '',
  description: '',
  version: '',
  created_at: '',
  icp_filing: '',
  public_security_filing: '',
  bilibili_url: '',
  gitee_url: '',
  github_url: '',
  name: '',
  job: '',
  address: '',
  email: '',
  qq_image: '',
  wechat_image: '',
})

const getWebsiteInfo = async () => {
  const res = await getWebsite()
  if (res.code === 0) {
    websiteInfo.value = res.data
    useWebsiteStore().state.websiteInfo = res.data
  }
}

getWebsiteInfo()

const shouldRefreshInfo = ref(false)
watch(() => shouldRefreshInfo.value, (newVal) => {
  if (newVal) {
    getWebsiteInfo()
    shouldRefreshInfo.value = false
  }
})

const updateWebsiteInfo = async () => {
  const res = await updateWebsite(websiteInfo.value)
  console.log(websiteInfo.value)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  } else {
    shouldRefreshInfo.value = true
  }
}

const handleLogoSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    websiteInfo.value.logo = res.data.url
    ElMessage.success(res.msg)
    updateWebsiteInfo()
  }
}

const clearLogo = () => {
  ElMessageBox.confirm(
      '是否清空Logo图片？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        websiteInfo.value.logo = ''
        updateWebsiteInfo()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })
}

const handleFullLogoSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    websiteInfo.value.full_logo = res.data.url
    ElMessage.success(res.msg)
    updateWebsiteInfo()
  }
}

const clearFullLogo = () => {
  ElMessageBox.confirm(
      '是否清空FullLogo图片？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        websiteInfo.value.full_logo = ''
        updateWebsiteInfo()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })
}

const handleQQImageSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    websiteInfo.value.qq_image = res.data.url
    ElMessage.success(res.msg)
    updateWebsiteInfo()
  }
}

const clearQQImageLogo = () => {
  ElMessageBox.confirm(
      '是否清空QQ图片？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        websiteInfo.value.qq_image = ''
        updateWebsiteInfo()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })
}

const handleWechatImageSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    websiteInfo.value.wechat_image = res.data.url
    ElMessage.success(res.msg)
    updateWebsiteInfo()
  }
}

const clearWechatImageLogo = () => {
  ElMessageBox.confirm(
      '是否清空微信图片？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        websiteInfo.value.wechat_image = ''
        updateWebsiteInfo()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })
}

const footerLinkList = ref<FooterLink[]>([])

const getFooterLinkList = async () => {
  const res = await websiteFooterLink()
  if (res.code === 0) {
    footerLinkList.value = res.data
  }
}

getFooterLinkList()

const shouldRefreshFooterLinkInfo = ref(false)
watch(() => shouldRefreshFooterLinkInfo.value, (newVal) => {
  if (newVal) {
    getFooterLinkList()
    shouldRefreshFooterLinkInfo.value = false
  }
})

const handleDeleteFooterLink = async (item: FooterLink) => {
  const res = await websiteDeleteFooterLink(item)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    shouldRefreshFooterLinkInfo.value = true
  }
}

const isShow = ref(false)

const footerLink = reactive<FooterLink>({
  title: '',
  link: '',
})

const handleCreateFooterLink = async (footerLink: FooterLink) => {
  const res = await websiteCreateFooterLink(footerLink)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    shouldRefreshFooterLinkInfo.value = true
  }
}


const carouselList = ref<string[]>([])

const getCarouseList = async () => {
  const res = await websiteCarousel()
  if (res.code === 0) {
    carouselList.value = res.data
  }
}

getCarouseList()

const addCarouse = async (url: string) => {
  const req: WebsiteCarouselOperation = {
    url: url,
  }
  const res = await websiteAddCarousel(req)
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
}

const handleCarouselSuccess = (res: ApiResponse<ImageUploadResponse>) => {
  if (res.code === 0) {
    addCarouse(res.data.url)
    ElMessage.success(res.msg)
    getCarouseList()
  }
}

const cancelCarousel = (url: string) => {
  ElMessageBox.confirm(
      '是否移除该首页图片？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(async () => {
        const req: WebsiteCarouselOperation = {
          url: url,
        }
        const res = await websiteCancelCarousel(req)
        if (res.code === 0) {
          ElMessage.success(res.msg)
          await getCarouseList()
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })

}
</script>

<style scoped lang="scss">
.site-config {
  display: flex;

  .title {
    border-left: 5px solid blue;
    padding-left: 10px;
  }

  .content {
    margin: 20px;

    .el-form {
      .el-form-item {
        .el-image {
          height: 120px;
        }

        .upload-content {
          display: flex;
          height: 60px;

          .container {
            margin: auto;

            .upload-filled {
              height: 32px;
              width: 32px;
            }
          }
        }

        .clear-button {
          display: flex;

          .el-button {
            margin-left: auto;
          }
        }
      }

      .delete-button {
        display: flex;

        .el-button {
          margin-left: auto;
          margin-bottom: 20px;
        }
      }
    }

    .button-group {
      .el-button {
        margin-bottom: 20px;
      }
    }

    .carousel-item {
      display: flex;
      padding: 20px;
      max-width: 400px;

      .el-image {
        height: 160px;
        margin-right: 20px;
        margin-bottom: 20px;
        margin-left: auto;
      }
    }
  }
}
</style>
<style lang="scss">
.el-upload {
  --el-upload-dragger-padding-horizontal: 0px;
  --el-upload-dragger-padding-vertical: 0px;
  line-height: 0;
}
</style>
