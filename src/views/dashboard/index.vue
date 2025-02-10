<template>
  <div class="dashboard">
    <el-container>
      <el-aside :class="{collapsed: isCollapse}">
        <logo/>
        <dashboard-menu/>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-top">
            <breadcrumb/>
            <div class="header-top-right">
              <auth-popover/>
            </div>
          </div>
          <dashboard-tag/>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Logo from "@/components/widgets/Logo.vue";
import Breadcrumb from "@/components/layout/Breadcrumb.vue";
import DashboardMenu from "@/components/layout/DashboardMenu.vue";
import {computed} from "vue";
import DashboardTag from "@/components/layout/DashboardTag.vue";
import AuthPopover from "@/components/common/AuthPopover.vue";
import {useLayoutStore} from "@/stores/layout";

const store = useLayoutStore()
const isCollapse = computed(() => store.state.isCollapse)
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;

  .el-aside {
    border: 1px solid #DCDFE6;
    width: 240px;
    height: 100vh;
    &::-webkit-scrollbar{
      display: none;
    }
  }

  .el-aside.collapsed {
    width: 64px;
  }

  .el-header {
    height: auto;
    border: 1px solid #DCDFE6;

    .header-top {
      display: flex;
      border-bottom: 1px solid #DCDFE6;

      .header-top-right {
        margin-left: auto;
        margin-top: auto;
        margin-bottom: auto;


      }
    }
  }

  .el-main{
    height: calc(100vh - 100px);
    &::-webkit-scrollbar{
      display: none;
    }
  }
}
</style>
