<template>
  <div class="search">
    <web-navbar :noScroll="true"/>
    <el-container class="main-content">
      <div class="container">
        <el-main>
          <div class="search">
            <el-input v-model="articleSearchRequest.query" placeholder="请输入搜索内容" prefix-icon="Search"
                      maxlength="50"
                      @change="changeArticleSearchItem"/>
            <el-button @click="changeArticleSearchItem">搜索</el-button>
          </div>

          <div class="category">
            <el-row size="large">类别</el-row>
            <el-radio-group v-model="articleSearchRequest.category" @change="changeArticleSearchItem">
              <el-radio-button label="全部" value=""/>
              <template v-for="item in categoryArr">
                <el-radio-button :label="item" :value="item"/>
              </template>
            </el-radio-group>
          </div>

          <div class="tag">
            <el-row size="large">标签</el-row>
            <el-radio-group v-model="articleSearchRequest.tag" @change="changeArticleSearchItem">
              <el-radio-button label="全部" value=""/>
              <template v-for="item in tagArr">
                <el-radio-button :label="item" :value="item"/>
              </template>
            </el-radio-group>
          </div>

          <div class="sort">
            <el-row size="large">排序</el-row>
            <el-button @click="handleSortClick();changeArticleSearchItem()">
              <el-icon :color="downColor">
                <component is="SortDown"></component>
              </el-icon>
              <el-icon :color="upColor">
                <component is="SortUp"></component>
              </el-icon>
            </el-button>
            <el-radio-group v-model="articleSearchRequest.sort" v-for="item in sortArr"
                            @change="changeArticleSearchItem">
              <el-radio-button :label="item.label" :value="item.value"/>
            </el-radio-group>
          </div>

          <el-table :data="articleTableData" :show-header="false" :row-style="{height: '150px'}">
            <el-table-column label="cover" width="200">
              <template #default="scope:{ row: any, column: any, $index: number }">
                <el-image style="width: 160px; height: 100px" :src="scope.row._source.cover" alt=""/>
              </template>
            </el-table-column>
            <el-table-column label="description">
              <template #default="scope:{ row: Hit<Article>, column: any, $index: number }">
                <div class="description" @click="handleArticleJumps(scope.row._id)">
                  <el-row class="title">{{ scope.row._source.title }}</el-row>
                  <el-text class="abstract" size="large">{{ scope.row._source.abstract }}</el-text>
                  <el-text class="footer">
                    <div class="tags">
                      <el-tag v-for="item in scope.row._source.tags">{{ item }}</el-tag>
                    </div>
                    <div class="status">
                      发布时间：{{ scope.row._source.created_at }}
                      <el-icon>
                        <component is="View"/>
                      </el-icon>
                      {{ scope.row._source.views }}
                      <el-icon>
                        <component is="ChatDotRound"/>
                      </el-icon>
                      {{ scope.row._source.comments }}
                      <el-icon>
                        <component is="Star"/>
                      </el-icon>
                      {{ scope.row._source.likes }}
                    </div>
                  </el-text>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
              :current-page="page"
              :page-size="page_size"
              :page-sizes="[10, 30, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
          />
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import WebNavbar from "@/components/layout/WebNavbar.vue";
import type {Hit} from "@/api/common";
import {type Article, articleCategory, articleSearch, type ArticleSearchRequest, articleTags} from "@/api/article";
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const articleSearchRequest = reactive<ArticleSearchRequest>({
  query: "",
  category: "",
  tag: "",
  sort: "",
  order: "desc",
  page: 1,
  page_size: 10,
})

const route = useRoute()
const router = useRouter()

const categoryArr = ref<string[]>([])
const tagArr = ref<string[]>([])
const sortArr = [
  {label: "默认", value: ""},
  {label: "时间", value: "time"},
  {label: "评论", value: "comment"},
  {label: "浏览", value: "view"},
  {label: "点赞", value: "like"},
]

const downColor = computed(() => {
  return articleSearchRequest.order === "desc" ? "blue" : "gray"
})
const upColor = computed(() => {
  return articleSearchRequest.order === "desc" ? "gray" : "blue"
})

const handleSortClick = () => {
  articleSearchRequest.order = articleSearchRequest.order === "desc" ? "asc" : "desc"
}

const getArticleCategory = async () => {
  const res = await articleCategory()
  if (res.code === 0) {
    res.data.forEach((item) => {
      categoryArr.value.push(item.category)
    })
  }
}

getArticleCategory()

const getArticleTags = async () => {
  const res = await articleTags()
  if (res.code === 0) {
    res.data.forEach((item) => {
      tagArr.value.push(item.tag)
    })
  }
}

getArticleTags()

const page = ref(1)
const page_size = ref(10)
const total = ref(0)
const articleTableData = ref<Hit<Article>[]>()

onMounted(() => {
  articleSearchRequest.query = route.query.query as string || ""
  articleSearchRequest.category = route.query.category as string || ""
  articleSearchRequest.tag = route.query.tag as string || ""
  articleSearchRequest.sort = route.query.sort as string || ""
  articleSearchRequest.order = route.query.order as string || "desc"
  page.value = Number(route.query.page) || 1
  page_size.value = Number(route.query.page_size) || 10
})


const getArticleSearchTableData = async () => {
  articleSearchRequest.page = page.value;
  articleSearchRequest.page_size = page_size.value;

  const table = await articleSearch(articleSearchRequest)

  if (table.code === 0) {
    articleTableData.value = table.data.list;
    total.value = table.data.total;
  }

  await router.push({
    path: router.currentRoute.value.path,
    query: {
      query: articleSearchRequest.query,
      category: articleSearchRequest.category,
      tag: articleSearchRequest.tag,
      sort: articleSearchRequest.sort,
      order: articleSearchRequest.order,
      page: articleSearchRequest.page,
      page_size: articleSearchRequest.page_size,
    }
  })
}

watch(() => route.query, (newQuery) => {
  articleSearchRequest.query = newQuery.query as string || ""
  articleSearchRequest.category = newQuery.category as string || ""
  articleSearchRequest.tag = newQuery.tag as string || ""
  articleSearchRequest.sort = newQuery.sort as string || ""
  articleSearchRequest.order = newQuery.order as string || "desc"
  articleSearchRequest.page = Number(newQuery.page) || 1
  articleSearchRequest.page_size = Number(newQuery.page_size) || 10
}, {immediate: true})

nextTick(() => {
  getArticleSearchTableData()
})

const changeArticleSearchItem = () => {
  getArticleSearchTableData()
}

const handleArticleJumps = (id: string) => {
  window.open("/article/" + id)
}

const handleSizeChange = (val: number) => {
  page_size.value = val
  getArticleSearchTableData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getArticleSearchTableData()
}

</script>

<style scoped lang="scss">
.search {
  .main-content {
    margin-top: 70px;
    display: flex;
    justify-content: center;

    .container {
      display: flex;
      max-width: 1400px;
      width: 100%;

      .search {
        display: flex;

        .el-input {
          margin-left: auto;
          width: 320px;
        }
      }

      .category {
        display: flex;
        margin: 10px;

        .el-row {
          margin-right: 32px;
        }

        .el-radio-group {
          max-width: 1276px;
        }
      }

      .tag {
        display: flex;
        margin: 10px;

        .el-row {
          margin-right: 32px;
        }

        .el-radio-group {
          max-width: 1276px;
        }
      }

      .sort {
        display: flex;
        margin: 10px;

        .el-button {
          width: 32px;
          padding: unset;
          border: none;
          background-color: transparent;
        }

        .el-radio-group {
          max-width: 1276px;
        }
      }

      .el-table {
        .description {
          height: 120px;
          display: flex;
          flex-direction: column;

          .title {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .abstract {
            margin-right: auto;
          }

          .footer {
            margin-top: auto;
            display: flex;
            width: 100%;
            .tags{
              margin-right: auto;
              .el-tag{
                margin-right: 10px;
              }
            }
            .status{
              margin-left: auto;
            }
          }
        }
      }

      .el-pagination {
        margin-top: 10px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
