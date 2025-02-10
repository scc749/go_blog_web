<template>
  <div class="web-footer">
    <div class="container">
      <div class="footer-left">
        <div class="full-logo">
          <el-image
              :src="websiteStore.state.websiteInfo.full_logo===''?'/image/full_logo.png':websiteStore.state.websiteInfo.full_logo"
              alt=""/>
        </div>
        <el-text>{{ websiteStore.state.websiteInfo.description }}</el-text>
      </div>
      <div class="footer-center">
        <el-space size="large" spacer="|">
          <div class="footer-link" v-for="item in footerLinkList" :key="item.title">
            <el-link :href=item.link>{{ item.title }}</el-link>
          </div>
        </el-space>
        <div class="create-at">
          <el-text>建站日期：{{ websiteStore.state.websiteInfo.created_at }} 网站已运行：{{ elapsedTime }}</el-text>
        </div>
        <div class="filing">
          <el-image src="/image/filing.png" alt=""/>
          <el-link href="https://beian.miit.gov.cn/#/Integrated/index" :underline="false">
            {{ websiteStore.state.websiteInfo.icp_filing }}
          </el-link>
          <el-link :href=publicSecurityFilingLink :underline="false">
            {{ websiteStore.state.websiteInfo.public_security_filing }}
          </el-link>
        </div>
        <div class="bottom">
          <div class="version">
            <el-tag type="primary" size="large">version</el-tag>
            <el-tag type="info" size="large">{{ websiteStore.state.websiteInfo.version }}</el-tag>
          </div>
          <div class="social-link">
            <el-link v-for="socialLink in socialLinks" :href=socialLink.url :underline="false">
              <el-image :src=socialLink.src :alt=socialLink.alt></el-image>
            </el-link>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <el-image src="/image/xiaochun_character_transparent.png" alt=""/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useWebsiteStore} from "@/stores/website";
import {computed} from "vue";
import {ref} from "vue";
import {onUnmounted} from "vue";
import {type FooterLink, websiteFooterLink} from "@/api/website";

const footerLinkList=ref<FooterLink[]>([])

const getFooterLinkList =async ()=>{
  const res = await websiteFooterLink()
  if (res.code===0){
    footerLinkList.value=res.data
  }
}

getFooterLinkList()

const websiteStore = useWebsiteStore()

let timerId: number | null = null;
const elapsedTime = ref("");

function updateElapsedTime() {
  let creationDate = websiteStore.state.websiteInfo.created_at;
  if (creationDate) {
    let creationTimestamp = new Date(creationDate).getTime();
    let currentTimestamp = new Date().getTime();

    let totalDays = (currentTimestamp - creationTimestamp) / 1000 / (60 * 60 * 24);
    let daysPassed = Math.floor(totalDays);
    let hoursRemaining = Math.floor((totalDays - daysPassed) * 24);
    let minutesRemaining = Math.floor((totalDays - daysPassed - (hoursRemaining / 24)) * 24 * 60);
    let secondsRemaining = Math.floor((totalDays - daysPassed - (hoursRemaining / 24) - (minutesRemaining / 24 / 60)) * 24 * 60 * 60);

    elapsedTime.value = `${daysPassed}天${hoursRemaining}时${minutesRemaining}分${secondsRemaining}秒`;
  }
}

function initializeTimer() {
  updateElapsedTime();
  timerId = setInterval(updateElapsedTime, 1000);
}

onUnmounted(() => {
  clearInterval(timerId as number);
});

initializeTimer();

const publicSecurityFilingLink = computed(() => "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=" + websiteStore.state.websiteInfo.public_security_filing.match(/\d+/))
const socialLinks = computed(() => [
  {
    src: "/image/bilibili.png",
    alt: "",
    url: websiteStore.state.websiteInfo.bilibili_url
  },
  {
    src: "/image/gitee.png",
    alt: "",
    url: websiteStore.state.websiteInfo.gitee_url
  },
  {
    src: "/image/github.png",
    alt: "",
    url: websiteStore.state.websiteInfo.github_url
  },
])

</script>


<style scoped lang="scss">
.web-footer {
  display: flex;
  justify-content: center;

  .container {
    display: flex;
    max-width: 1400px;
    width: 100%;

    .footer-left {
      width: 25%;
      margin-bottom: auto;
      margin-top: auto;

      .el-image {
        height: 80px;
      }
    }

    .footer-center {
      width: 40%;
      margin: auto 5%;

      .footer-link {
        .el-link {
          margin-top: 20px;
          margin-bottom: 20px;
        }
      }

      .create-at {
        margin-bottom: 20px;
      }

      .filing {
        display: flex;

        .el-image {
          margin-bottom: auto;
          margin-top: auto;
        }

        .el-link {
          margin-left: 5px;
          margin-right: 10px;
        }
      }

      .bottom {
        display: flex;
        margin-top: 20px;

        .social-link {
          .el-link {
            margin-left: 40px;
          }
        }
      }


    }

    .footer-right {
      width: 25%;
      margin-bottom: auto;
      margin-top: auto;
      display: flex;

      .el-image {
        margin-left: auto;
        height: 200px;
      }

    }
  }
}
</style>
