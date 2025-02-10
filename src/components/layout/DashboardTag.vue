<template>
  <div class="dashboard-tag">
    <el-tag
        v-for="tag in tags"
        :closable="tag.name!=='home'"
        :key="tag.name"
        :effect="route.name === tag.name?'light':'plain'"
        type="info"
        @close="handleClose(tag.name)"
        @click="handleTag(tag.name)"
    >
      {{ tag.title }}
    </el-tag>
    <el-button class="close-button" size="small" @click="closeAllTags">
      关闭全部
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import {useTagStore} from "@/stores/tag";
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";

const route = useRoute()
const store = useTagStore()
const router = useRouter()

const tags = computed(() => store.state.tags)
const handleClose = (tagName: string) => {
  const tags = store.state.tags;

  // 如果要删除的 tag 不是当前路由，则直接删除
  if (tagName !== route.name) {
    store.state.tags = tags.filter(tag => tag.name !== tagName);
    return;
  }

  // 如果要删除的 tag 是当前路由，先找到要删除的 tag 的索引
  const index = tags.findIndex(tag => tag.name === tagName);

  // 如果找到了该 tag
  if (index !== -1) {
    // 先删除该 tag
    store.state.tags = tags.filter(tag => tag.name !== tagName);

    // 计算要跳转的上一个 tag 的名称
    const previousTag = index > 0 ? tags[index - 1].name : null;

    // 跳转到上一个 tag 或默认路由
    if (previousTag) {
      router.push({name: previousTag});
    } else {
      router.push({name: 'home'});
    }
  }
}

const handleTag = (tagName: string) => {
  router.push({name: tagName})
}


const closeAllTags = () => {
  store.state.tags = [
    {
      title: "主页",
      name: "home"
    }
  ];
  router.push({name: 'home'});
}
</script>

<style scoped lang="scss">
.dashboard-tag {
  display: flex;
  margin-top: 5px;
  margin-bottom: 5px;

  .el-tag {
    font-size: 16px;
    margin-right: 5px;
  }

  .el-button {
    font-size: 16px;
    margin-left: auto;
  }
}
</style>
