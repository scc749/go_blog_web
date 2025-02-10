<template>
  <div class="dashboard-menu">
    <div class="collapse-button">
      <el-button @click="handleCollapse">
        <el-icon>
          <component :is="icon"></component>
        </el-icon>
      </el-button>
    </div>
    <el-menu :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="$route.path">
      <template v-for="item in menuList">
        <el-menu-item v-if="!item.subItems" :index="generatePathForSingleItem(item)">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else-if="!item.admin_role||userStore.isAdmin" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="subItem in item.subItems" :index="generatePathForSubItem(item,subItem)"
                        @click="handleClick(subItem)">
            <el-icon>
              <component :is="subItem.icon"></component>
            </el-icon>
            <span>{{ subItem.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import type {Tag} from "@/stores/tag";
import {computed} from "vue";
import {useLayoutStore} from "@/stores/layout";
import {useTagStore} from "@/stores/tag";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

interface MenuItem {
  title: string;
  name: string;
  icon: string;
  subItems?: MenuItem[];
  admin_role?:boolean;
}

const menuList: MenuItem[] = [
  {
    title: "主页",
    name: "",
    icon: "House"
  },
  {
    title: "个人中心",
    name: "user-center",
    icon: "Monitor",
    subItems: [
      {
        title: "我的信息",
        name: "user-info",
        icon: "Postcard"
      },
      {
        title: "我的收藏",
        name: "user-star",
        icon: "Star"
      },
      {
        title: "我的评论",
        name: "user-comment",
        icon: "ChatDotRound"
      },
      {
        title: "我的反馈",
        name: "user-feedback",
        icon: "Message"
      }
    ]
  },
  {
    title: "用户管理",
    name: "users",
    icon: "User",
    admin_role:true,
    subItems: [
      {
        title: "用户列表",
        name: "user-list",
        icon: "SetUp"
      }
    ]
  },
  {
    title: "文章管理",
    name: "articles",
    icon: "Document",
    admin_role:true,
    subItems: [
      {
        title: "发布文章",
        name: "article-publish",
        icon: "Collection"
      },
      {
        title: "评论列表",
        name: "comment-list",
        icon: "ChatLineRound"
      },
      {
        title: "文章列表",
        name: "article-list",
        icon: "DocumentCopy"
      }
    ]
  },
  {
    title: "图片管理",
    name: "images",
    icon: "Picture",
    admin_role:true,
    subItems: [
      {
        title: "图片列表",
        name: "image-list",
        icon: "PictureRounded"
      }
    ]
  },
  {
    title: "系统管理",
    name: "system",
    icon: "Coin",
    admin_role:true,
    subItems: [
      {
        title: "反馈列表",
        name: "feedback-list",
        icon: "Position"
      },
      {
        title: "广告列表",
        name: "advertisement-list",
        icon: "Connection"
      },
      {
        title: "友链列表",
        name: "friend-link-list",
        icon: "Link"
      },
      {
        title: "登录日志",
        name: "login-logs",
        icon: "memo"
      },
      {
        title: "应用配置",
        name: "app-config",
        icon: "setting"
      }
    ]
  }
]

const layoutStore = useLayoutStore()
const tagStore = useTagStore()
const isCollapse = computed(() => layoutStore.state.isCollapse)
const icon = computed(() => layoutStore.state.isCollapse ? "Expand" : "Fold")

const handleCollapse = () => {
  layoutStore.state.isCollapse = !layoutStore.state.isCollapse
}

function generatePathForSingleItem(item: MenuItem): string {
  return '/dashboard/' + item.name;
}

function generatePathForSubItem(parentItem: MenuItem, subItem: MenuItem): string {
  return '/dashboard/' + parentItem.name + '/' + subItem.name;
}

function handleClick(subItem: MenuItem) {
  const newTag: Tag = {
    title: subItem.title,
    name: subItem.name
  }
  const exists = tagStore.state.tags.some(tag => tag.name === newTag.name);
  if (exists) {
    return;
  }
  tagStore.state.tags.push(newTag);
}
</script>

<style scoped lang="scss">
.dashboard-menu {
  .collapse-button {
    display: flex;

    .el-button {
      margin-left: auto;
      border-style: none;
    }
  }

  .el-menu {
    border-right: none;
    --el-menu-item-height: 52px;
    --el-menu-sub-item-height: 44px;
  }

  .el-popper {
    .el-menu-item {
      height: 44px;
      width: 140px;
    }
  }
}

.collapsed .dashboard-menu .collapse-button .el-button {
  margin-right: auto;
}
</style>

<style lang="scss">
.el-menu--popup {
  min-width: 140px;
}
</style>
