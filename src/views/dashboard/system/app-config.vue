<template>
  <div class="system-config">
    <el-container>
      <el-aside width="160px">
        <el-menu :collapse-transition="false" :router="true" :default-active="$route.path">
          <template v-for="item in menuList">
            <el-menu-item :index="generatePathForSingleItem(item)">
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  title: string;
  name: string;
}

const menuList: MenuItem[] = [
  {
    title: "网站配置",
    name: "site-config",
  },
  {
    title: "系统配置",
    name: "system-config",
  },
  {
    title: "邮箱配置",
    name: "email-config",
  },
  {
    title: "QQ登录配置",
    name: "qq-config",
  },
  {

    title: "七牛云配置",
    name: "qiniu-config",
  },
  {
    title: "jwt配置",
    name: "jwt-config",
  },
  {
    title: "高德配置",
    name: "gaode-config",
  }
]

function generatePathForSingleItem(item: MenuItem): string {
  return '/dashboard/system/app-config/' + item.name;
}
</script>

<style scoped lang="scss">
.el-menu{
  height: 100%;
}
</style>
