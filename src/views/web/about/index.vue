<template>
  <div class="about">
    <web-navbar :noScroll="true"/>
    <el-container class="main-content">
      <div class="container">
        <el-main>
          <MdPreview :modelValue="text"/>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import WebNavbar from "@/components/layout/WebNavbar.vue";
import {MdPreview} from "md-editor-v3";
import {ref} from "vue";

const text=ref(`# 后端技术栈（Gin）

## Web 框架：

Gin (github.com/gin-gonic/gin):
这是一个高性能的 Go web 框架，用于构建 RESTful API 和 Web 服务。
Gin-Contrib (github.com/gin-contrib/sessions):
提供会话管理支持。

## 数据库：

GORM (gorm.io/gorm, gorm.io/driver/mysql):
一个用于 Go 的 ORM（对象关系映射）库，配合 MySQL 数据库使用。
MySQL：使用 GORM 连接 MySQL 数据库。

## 身份验证和授权：

JWT (JSON Web Tokens) (github.com/golang-jwt/jwt/v4):
用于生成和解析 JWT token，提供用户身份验证和授权功能。

## Redis：

Go-Redis (github.com/go-redis/redis):
用于与 Redis 数据库进行通信，常用于缓存和会话存储。

## 日志：

Zap (go.uber.org/zap):
Uber 提供的高性能日志库。

## 邮件发送：

Email (github.com/jordan-wright/email):
用于在应用中发送电子邮件。

## 任务调度：

Cron (github.com/robfig/cron/v3):
用于管理定时任务的库。

## 文件上传：

Qiniu SDK (github.com/qiniu/go-sdk/v7):
用于与七牛云存储服务进行集成，支持文件上传。

## 验证码：

Base64Captcha (github.com/mojocn/base64Captcha):
用于生成和验证图形验证码。

## Elasticsearch：

Elastic-Transport Go 和 Go Elasticsearch (github.com/elastic/elastic-transport-go/v8, github.com/elastic/go-elasticsearch/v8):
用于集成 Elasticsearch 搜索引擎。

# 前端技术栈（Vue3+Ts+Setup）

## Vue 3 (vue):

使用 Vue 3 作为前端框架，提供响应式数据绑定和组件化开发。

## Vite (vite):

一个现代的前端构建工具，用于快速开发和构建 Vue 项目。

## Pinia (pinia):

Vue 3 的状态管理库，类似于 Vuex，但 API 更加简洁。

## Vue Router (vue-router):

用于 Vue 应用的路由管理。

## Element Plus (element-plus):

基于 Vue 3 的 UI 组件库，提供丰富的用户界面组件。

## Axios (axios):

一个基于 Promise 的 HTTP 客户端，用于与后端 API 进行通信。

## ECharts (echarts):

一个开源的可视化图表库，支持多种图表类型，适用于数据展示。

## Sass (sass):

一种 CSS 预处理器，用于编写更具结构化和可维护性的 CSS。
开发工具和其他依赖

## TypeScript (typescript):

项目使用 TypeScript 增强 JavaScript 的类型系统，提升代码的可靠性。

## Vite 插件 (@vitejs/plugin-vue):

Vite 的 Vue 插件，用于支持 Vue 单文件组件的构建和热重载。

## 自动导入插件 (unplugin-auto-import, unplugin-vue-components):

通过自动导入，减少手动导入模块的需要，简化开发过程。

## Vue Type Checking (vue-tsc):

TypeScript 与 Vue 配合的类型检查工具，确保在开发过程中发现类型问题。

# 总结

后端使用了 Go 语言、Gin 框架、GORM ORM、JWT、Redis、Elasticsearch、Zap 日志等技术栈，主要用于构建高性能的 RESTful API 服务。
前端使用了 Vue 3、Vite、Pinia、Element Plus、ECharts 等技术栈，提供一个现代化、响应式的 Web 前端。
其他工具包括 TypeScript、Sass 和各种辅助库，增强了开发体验和代码质量。
这个项目集成了现代的后端和前端技术栈，适用于构建一个高效且易于扩展的博客或管理系统。

`)
</script>

<style scoped lang="scss">
.about {
  .main-content {
    margin-top: 70px;
    display: flex;
    justify-content: center;

    .container {
      display: flex;
      max-width: 1400px;
      width: 100%;
    }
  }
}
</style>
