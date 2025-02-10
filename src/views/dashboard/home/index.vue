<template xmlns="http://www.w3.org/1999/html">
  <div class="home">
    <div class="header">
      <el-card class="user-card">
        <el-row>
          你好，{{ userStore.state.userInfo.username }}，今天也要加油啊！
        </el-row>
        <div class="weather">
          {{ weatherInfo }}
        </div>
      </el-card>
    </div>

    <div class="content">
      <el-col :span="14">
        <el-card class="entrance-card">
          <el-row class="title">
            快捷入口
          </el-row>
          <div class="button-group">
            <div class="button-item" v-for="item in entranceList">
              <el-button :icon="item.icon" :type="item.type" plain @click="handleClick(item)"/>
              {{ item.title }}
            </div>
          </div>
        </el-card>
        <el-card class="chart-card">
          <el-row class="title">
            用户数据
          </el-row>
          <div class="time-select">
            <el-select
                @change="getChartInfo"
                v-model="userChartRequest.date"
                placeholder="Select"
                style="width: 200px"
            >
              <el-option
                  v-for="item in userChartOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>
          <user-activity-chart v-if="isShow" :chart="chart"/>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="aside">
          <el-row class="title">
            博客声明
          </el-row>
          <div class="text">
            <el-text>
              欢迎访问本博客！本博客致力于分享技术文章、开发经验及个人心得，内容主要涵盖编程技术、前端开发、后端开发、数据库设计、软件架构、开源项目等领域。<br>
              <h3>版权声明</h3>
              本博客中的所有原创文章版权归博客作者所有，转载请注明来源。<br>
              部分文章可能涉及引用其他来源的内容，引用的内容会明确标注出处，版权归原作者所有。<br>
              如果您认为本博客的某些内容侵犯了您的版权或其他权益，请及时联系我们，我们将立即处理。<br>
              <h3>使用条款</h3>
              本博客内容仅供参考和学习交流使用。作者不对内容的准确性、完整性或时效性作出保证，使用时请自行判断。<br>
              本博客的部分内容可能受到第三方工具、平台的影响，无法完全控制其准确性和可用性，使用时请谨慎。<br>
              <h3>隐私政策</h3>
              本博客不会主动收集您的个人信息，除非您主动通过留言、评论或联系方式与我们进行交流。<br>
              所有个人信息将严格保密，不会外泄或用于其他不当用途。<br>
              <h3>联系方式</h3>
              如有任何问题或建议，欢迎通过以下方式与我们联系：<br>
              邮箱：[{{ useWebsiteStore().state.websiteInfo.email }}]<br>
              感谢您的支持和关注，希望本博客能为您的技术成长和知识积累带来帮助！<br>
            </el-text>
          </div>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {ref} from "vue";
import {userChart, type UserChartRequest, type UserChartResponse, userWeather} from "@/api/user";
import UserActivityChart from "@/components/widgets/UserActivityChart.vue";
import {useWebsiteStore} from "@/stores/website";
import router from "@/router";
import {type Tag, useTagStore} from "@/stores/tag";

const userStore = useUserStore()

const weatherInfo = ref('')

const getWeatherInfo = async () => {
  const res = await userWeather()
  if (res.code === 0) {
    weatherInfo.value = res.data
  }
}

getWeatherInfo()

interface Entrance {
  title: string
  name: string;
  icon: string;
  type: string;
}

const entranceList: Entrance[] = [
  {
    title: '我的信息',
    name: 'user-info',
    icon: 'Postcard',
    type: 'primary',
  },
  {
    title: '我的收藏',
    name: 'user-star',
    icon: 'Star',
    type: 'warning',
  },
  {
    title: '我的评论',
    name: 'user-comment',
    icon: 'ChatDotRound',
    type: 'info',
  },
  {
    title: '我的反馈',
    name: 'user-feedback',
    icon: 'Message',
    type: 'success',
  }
]

const tagStore = useTagStore()

function handleClick(item: Entrance) {
  const newTag: Tag = {
    title: item.title,
    name: item.name
  }
  const exists = tagStore.state.tags.some(tag => tag.name === newTag.name);
  if (exists) {
    return;
  }
  tagStore.state.tags.push(newTag);
  router.push({name:item.name})
}

const userChartRequest = ref<UserChartRequest>({
  date: 7,
})

const userChartOptions = [
  {
    value: 7,
    label: '七天',
  },
  {
    value: 30,
    label: '一个月',
  },
  {
    value: 90,
    label: '三个月',
  },
  {
    value: 180,
    label: '六个月',
  },
  {
    value: 365,
    label: '一年',
  },
]

const chart = ref<UserChartResponse>(
    {
      date_list: [],
      login_data: [],
      register_data: [],
    }
)

const isShow = ref(false)

const getChartInfo = async () => {
  isShow.value = false
  const res = await userChart(userChartRequest.value)
  if (res.code === 0) {
    chart.value = res.data
    isShow.value = true
  }
}

getChartInfo()

</script>

<style scoped lang="scss">
.home {
  .header {
    margin-bottom: 20px;

    .user-card {
      .el-row {
        font-size: 32px;
      }

      .weather {
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
  }

  .content {
    display: flex;

    .entrance-card {
      margin-bottom: 20px;

      .title {
        font-size: 24px;
      }

      .button-group {
        display: flex;
        margin-top: 20px;
        margin-bottom: 20px;

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
    }

    .chart-card {
      .title {
        font-size: 24px;
      }

      .time-select {
        display: flex;
        margin-top: 20px;
        margin-bottom: 40px;

        .el-select {
          margin-left: auto;
        }
      }

      .user-activity-chart {
        position: relative;
      }
    }

    .aside {
      margin-left: 20px;
      height: 100%;

      .title {
        font-size: 24px;
      }

      .text {
        margin-top: 20px;
      }
    }
  }
}
</style>
