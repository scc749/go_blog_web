<template>
  <div class="news">
    <web-navbar :noScroll="true"/>
    <el-container class="main-content">
      <div class="container">
        <el-main>
          <el-tabs model-value="baidu" @tab-click="handleNewsTabClick">
            <el-tab-pane v-for="item in newsTypeList" :name="item.name">
              <template #label>
                <el-image :src="item.src" alt=""></el-image>
                <el-row>{{ item.label }}</el-row>
              </template>
              <el-table
                  :data="newsTableData"
                  :show-header="false"
                  :row-style="{height: '150px'}"
              >
                <el-table-column label="序号" prop="index" width="60"/>
                <el-table-column label="图片" width="240">
                  <template #default="scope:{ row: any, column: any, $index: number }">
                    <el-image style="width: 180px; height: 100px" :src="scope.row.image" alt="" fit="cover"/>
                  </template>
                </el-table-column>
                <el-table-column label="内容">
                  <template #default="scope:{ row: any, column: any, $index: number }">
                    <div class="content" @click="handleNewsTableClick(scope.row)">
                      <el-row class="title">{{ scope.row.title }}</el-row>
                      <el-text class="description" size="large" line-clamp="4">{{ scope.row.description }}</el-text>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="热度" prop="popularity" width="120"/>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import WebNavbar from "@/components/layout/WebNavbar.vue";
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
      newsMap.set(source, res.data.hot_list)
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
.news {
  .main-content {
    margin-top: 70px;
    display: flex;
    justify-content: center;

    .container {
      display: flex;
      max-width: 1400px;
      width: 100%;

      .el-tabs {
        .el-tab-pane {
          .el-table {
            .content {
              .title {
                font-size: 24px;
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
