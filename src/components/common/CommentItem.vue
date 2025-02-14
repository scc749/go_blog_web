<template>
  <div class="comment-item">
    <div v-for="item in comments" :key="item.id">
      <div class="item-card">
        <div class="title">
          <el-popover width="280">
            <template #reference>
              <el-avatar :src="item.user.avatar"/>
            </template>
            <template #default>
              <user-card :uuid="''"
                         :user-card-info="{uuid:item.user.uuid,username:item.user.username,avatar:item.user.avatar,address:item.user.address,signature:item.user.signature}"/>
            </template>
          </el-popover>
          <div class="name">
            {{ item.user.username }}
          </div>
          <div class="time">
            {{ getTime(item.created_at) }}
          </div>
        </div>
        <MdPreview class="content" :modelValue="item.content"/>
        <div class="footer">
          <div class="button-group">
            <el-button v-if="replyFlag===item.id" type="primary" @click="submitReply(item);content=''">确定</el-button>
            <el-button v-if="replyFlag===item.id" @click="content='';replyFlag=0">取消</el-button>
            <el-button v-if="!(replyFlag===item.id)" type="primary" @click="replyFlag=item.id">回复</el-button>
            <el-button v-if="(item.user_uuid===userStore.state.userInfo.uuid||userStore.isAdmin)&&!(replyFlag===item.id)" type="danger"
                       @click="handleDelete(item.id)">
              删除
            </el-button>
          </div>
        </div>
        <div v-if="replyFlag===item.id" class="reply">
          <el-input class="comment-input" v-model="content" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea"
                    placeholder="在这里输入您的回复..." maxlength="320"/>
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
        </div>
      </div>
      <div v-if="item.children && item.children.length" class="item-children">
        <comment-item :comments="item.children"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type Comment,
  commentCreate,
  type CommentCreateRequest,
  commentDelete,
  type CommentDeleteRequest
} from "@/api/comment";
import {userCard} from "@/api/user";
import UserCard from "@/components/widgets/UserCard.vue";
import {useUserStore} from "@/stores/user";
import {MdPreview} from "md-editor-v3";
import {ref} from "vue";
import {useLayoutStore} from "@/stores/layout";

defineProps<{
  comments: Comment[];
}>();

const userStore = useUserStore()
const getTime = (date: Date): string => {
  const time = new Date(date)
  return time.toLocaleString()
}

const replyFlag = ref(0)
const content = ref('')
const numbers = ref(Array.from({length: 50}, (_, i) => (i + 1).toString().padStart(2, '0')));

const layoutStore = useLayoutStore()

const submitReply = async (item: Comment) => {
  const commentCreateRequest: CommentCreateRequest = {
    article_id: item.article_id,
    p_id: item.id,
    content: content.value,
  }
  const res = await commentCreate(commentCreateRequest)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.shouldRefreshCommentList = true
    replyFlag.value = 0
  }
}

const handleDelete = async (id: number) => {
  let ids: number[] = []
  ids.push(id)
  const commentDeleteRequest: CommentDeleteRequest = {
    ids: ids
  }
  const res = await commentDelete(commentDeleteRequest)
  if (res.code === 0) {
    ElMessage.success(res.msg)
    layoutStore.state.shouldRefreshCommentList = true
  }
}
</script>

<style scoped lang="scss">
.comment-item {
  .item-card {
    border: 1px solid #DCDFE6;
    padding: 10px;

    .title {
      display: flex;

      .name {
        align-content: center;
      }

      .time {
        margin-left: auto;;
        align-content: center;
      }
    }

    .footer {
      display: flex;

      .button-group {
        margin-left: auto;
      }
    }

    .reply {
      .comment-input {
        margin-top: 20px;
      }

      .comment-tool {
        margin-right: auto;

        .el-avatar {
          background-color: unset;
        }
      }
    }
  }


  .item-children {
    padding-left: 20px;
  }
}

.el-popover.el-popper {
  .el-image {
    height: 50px;
    width: 50px;
  }
}
</style>
