<template>
  <div class="article">
    <web-navbar :noScroll="true"/>
    <el-container class="main-content">
      <div class="container">
        <el-main>
          <div class="info">
            <el-row class="title">{{ articleInfo.title }}</el-row>
            <div class="time">
              <el-text>发布：{{ articleInfo.created_at }} 更新：{{ articleInfo.updated_at }}</el-text>
            </div>
            <el-row class="category">类别：{{ articleInfo.category }}</el-row>
            <el-row class="tags">标签：
              <el-tag v-for="item in articleInfo.tags" :key="item" effect="plain">{{ item }}</el-tag>
            </el-row>
            <div class="abstract">
              <el-text>{{ articleInfo.abstract }}</el-text>
            </div>
          </div>
          <MdPreview :id="mdID" :modelValue="articleInfo.content"/>
          <div class="comment" id="comment">
            <el-input v-model="content" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea"
                      placeholder="喜欢这篇文章吗？在这里与大家分享您的想法！" maxlength="320"/>
            <el-text>tip:请登录后再进行反馈!</el-text>
            <div class="operation">
              <div class="comment-tool">
                <el-popover width="502" trigger="click">
                  <template #reference>
                    <el-avatar src="/emoji/xiaochun_emoji_01.png"/>
                  </template>
                  <template #default>
                    <el-image
                        v-for="number in numbers"
                        :src="'/emoji/xiaochun_emoji_'+number+'.png'"
                        @click="content=content+'![]('+'/emoji/xiaochun_emoji_'+number+'.png'+')'"
                    />
                  </template>
                </el-popover>
              </div>
              <div class="button-group">
                <el-button size="large" type="primary" @click="submitComment">发表</el-button>
                <el-button size="large" @click="content=''">取消</el-button>
              </div>
            </div>
          </div>
          <div class="comment-list">
            <el-row class="title">评论</el-row>
            <comment-item :comments="comments"/>
          </div>
        </el-main>
        <el-aside>
          <div class="aside-content">
            <div class="catalog">
              <el-row class="title">目录</el-row>
              <MdCatalog :editorId="mdID" :scrollElement="scrollElement" :offsetTop="100" :scrollElementOffsetTop="80"/>
            </div>

            <div class="status">
              <el-icon size="24">
                <component is="View"/>
              </el-icon>
              {{ articleInfo.views }}
              <el-icon size="24">
                <component is="ChatDotRound"/>
              </el-icon>
              {{ articleInfo.comments }}
              <el-icon size="24" @click="handelLike">
                <component v-if="!isLike" is="Star"/>
                <component v-else is="StarFilled"/>
              </el-icon>
              {{ articleInfo.likes }}
            </div>
            <el-anchor class="comment-link" :marker="false">
              <el-anchor-link href="#comment">点击此处跳转至评论</el-anchor-link>
            </el-anchor>
          </div>
        </el-aside>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {type Article, articleInfoByID} from "@/api/article";
import router from "@/router";
import {computed, onMounted, ref, watch} from "vue";
import {MdPreview, MdCatalog} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'md-editor-v3/lib/preview.css';
import WebNavbar from "@/components/layout/WebNavbar.vue";
import CommentItem from "@/components/common/CommentItem.vue";
import {articleIsLike, articleLike, type ArticleLikeRequest} from "@/api/article";
import {type Comment, commentCreate, type CommentCreateRequest, commentInfoByArticleID} from "@/api/comment";
import {useLayoutStore} from "@/stores/layout";
import {useUserStore} from "@/stores/user";

const mdID = "md-id"

const articleInfo = ref<Article>({
  created_at: '',
  updated_at: '',
  cover: '',
  title: '',
  keyword: '',
  category: '',
  tags: [],
  abstract: '',
  content: '',
  comments: 0,
  views: 0,
  likes: 0,
})

const scrollElement = document.documentElement

const route = useRoute()

const articleID = computed(() => route.params.id)

const getArticleInfo = async () => {
  const res = await articleInfoByID(articleID.value as string)
  if (res.code === 0) {
    articleInfo.value = res.data
  } else {
    await router.push({name: "404"})
  }
}

getArticleInfo()

const isLike = ref(false)

const getIsLikeInfo = async () => {
  const req: ArticleLikeRequest = {
    article_id: articleID.value as string
  }
  const res = await articleIsLike(req)
  if (res.code === 0) {
    isLike.value = res.data
  }
}

if (useUserStore().state.userInfo.role_id !== 0) {
  getIsLikeInfo()
}

const handelLike = async () => {
  const req: ArticleLikeRequest = {
    article_id: articleID.value as string
  }
  const res = await articleLike(req)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    articleInfo.value.likes += isLike.value ? -1 : 1
    isLike.value = !isLike.value
  }
}

const content = ref('')

const numbers = ref(Array.from({length: 50}, (_, i) => (i + 1).toString().padStart(2, '0')));

const submitComment = async () => {
  const commentCreateRequest: CommentCreateRequest = {
    article_id: articleID.value as string,
    p_id: null,
    content: content.value,
  }
  const res = await commentCreate(commentCreateRequest)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    content.value = ''
    layoutStore.state.shouldRefreshCommentList = true
  }
}

const comments = ref<Comment[]>([])

const getArticleCommentsInfo = async () => {
  comments.value = []
  const res = await commentInfoByArticleID(articleID.value as string)
  if (res.code === 0) {
    comments.value = res.data
  }
}

onMounted(() => {
  getArticleCommentsInfo()
})

const layoutStore = useLayoutStore()
watch(() => layoutStore.state.shouldRefreshCommentList, (newVal) => {
  if (newVal) {
    getArticleCommentsInfo()
    layoutStore.state.shouldRefreshCommentList = false
  }
})
</script>

<style scoped lang="scss">
.article {
  .main-content {
    margin-top: 70px;
    display: flex;
    justify-content: center;

    .container {
      display: flex;
      max-width: 1400px;
      width: 100%;

      .el-main {
        width: 70%;

        .info {
          border: 1px solid #DCDFE6;
          padding: 20px;

          .title {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .time {
            margin-bottom: 10px;
          }

          .category {
            margin-bottom: 10px;
          }

          .tags {
            margin-bottom: 10px;
          }

          .abstract {
            margin-bottom: 10px;
          }
        }

        .comment {
          border-top: 1px solid #DCDFE6;
          padding-top: 20px;

          .operation {
            margin-top: 20px;
            margin-bottom: 20px;
            display: flex;

            .comment-tool {
              margin-right: auto;

              .el-avatar {
                background-color: unset;
              }
            }

            .button-group {
              margin-left: auto;
            }
          }
        }

        .comment-list {
          .title {
            font-size: 24px;
            margin-bottom: 10px;
          }
        }
      }

      .el-aside {
        width: 30%;
        padding-top: 20px;

        .aside-content {
          position: fixed;

          .catalog {
            width: 420px;
            height: 70vh;
            overflow: auto;
            padding: 20px;
            border: 1px solid #DCDFE6;

            .title {
              font-size: 24px;
              margin-bottom: 10px;
            }
          }

          .status {
            justify-content: center;
            display: flex;
            padding: 20px;
            border-left: 1px solid #DCDFE6;
            border-right: 1px solid #DCDFE6;

            .el-icon {
              margin-left: 20px;
              margin-right: 20px;
            }
          }

          .comment-link {
            border-left: 1px solid #DCDFE6;
            border-right: 1px solid #DCDFE6;
            border-bottom: 1px solid #DCDFE6;
          }
        }
      }
    }
  }
}

.el-popover.el-popper {
  .el-image {
    height: 50px;
    width: 50px;
  }
}
</style>
