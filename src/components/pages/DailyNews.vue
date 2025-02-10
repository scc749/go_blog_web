<template>
  <el-card class="daily-news">
    <el-row class="title">每日新闻</el-row>
    <el-tabs model-value="baidu" @tab-click="handleNewsTabClick">
      <el-tab-pane v-for="item in newsTypeList" :name="item.name">
        <template #label>
          <el-image :src="item.src" alt=""></el-image>
          <el-row>{{ item.label }}</el-row>
        </template>
        <el-table
            :data="newsTableData"
            :row-style="{height: '64px'}"
        >
          <el-table-column prop="index" label="序号" width="60"/>
          <el-table-column label="标题">
            <template #default="scope:{ row: any, column: any, $index: number }">
              <el-text @click="handleNewsTableClick(scope.row)">
                {{ scope.row.title }}
              </el-text>
            </template>
          </el-table-column>
          <el-table-column prop="popularity" label="热度" width="120"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-text class="tip">以上仅显示前七条数据，详细数据请跳转
      <el-link href="/news">新闻</el-link>
    </el-text>
  </el-card>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {type HotItem, websiteNews, type WebsiteNewsRequest} from "@/api/website";
import type {TabsPaneContext} from "element-plus";

const newsTableData = ref<HotItem[]>()

interface newsTypeItem {
  name: string;
  label: string;
  src: string;
}

const newsTypeList: newsTypeItem[] = [
  {
    name: "baidu",
    label: "百度热搜",
    src: "/image/baidu.png"
  },
  {
    name: "zhihu",
    label: "知乎热榜",
    src: "/image/zhihu.png"
  },
  {
    name: "kuaishou",
    label: "快手热榜",
    src: "/image/kuaishou.png"
  },
  {
    name: "toutiao",
    label: "头条热榜",
    src: "/image/toutiao.png"
  }
]

const handleNewsTabClick = (tab: TabsPaneContext, _: Event) => {
  getNewsTableData(tab.paneName as string)
}

let newsMap = new Map<string, HotItem[]>

const getNewsTableData = async (source: string) => {
  if (!newsMap.has(source)) {
    const newsRequest: WebsiteNewsRequest = {
      source: source
    }
    const res = await websiteNews(newsRequest)
    if (res.code === 0) {
      newsMap.set(source, res.data.hot_list.slice(0, 7))
    }
  }
  newsTableData.value = newsMap.get(source)
}

getNewsTableData("baidu")

const handleNewsTableClick = (item: HotItem) => {
  window.open(item.url)
}
</script>

<style scoped lang="scss">
.daily-news {
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .el-tabs {
    .el-row {
      margin-left: 5px;
    }
  }

  .tip {
    display: flex;
    margin-top: 20px;

    .el-link {
      text-align: center;
    }
  }
}
</style>
