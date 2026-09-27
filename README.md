# Go Blog 前端

这是 Go Blog 的浏览器端项目，使用 Vue 3、TypeScript 和 Vite 编写。它包含公开博客页面和后台管理界面，通过 HTTP API 与 `server` 后端通信。

## 开始之前

- 安装 Node.js，项目开发时使用的版本是 Node.js 22.13.0。安装 Node.js 后会同时获得 npm。
- 先启动后端以及 MySQL、Redis、Elasticsearch。前端页面虽然可以单独启动，但文章、登录、配置等数据都由后端提供。
- 本地配置中的 API 前缀要与后端 `config.yaml` 的 `system.router_prefix` 一致。

## 本地开发

如果你在最大仓库根目录，先进入 `web`；如果终端已经在 `web` 目录，就直接安装依赖：

```bash
cd web
npm install
```

在 `web` 目录创建 `.env.local`，填写本机后端地址：

```dotenv
VITE_BASE_API=/api
VITE_SERVER_URL=http://127.0.0.1:8080
```

这里的 `VITE_SERVER_URL` 是后端服务的地址，不要在它后面再附加 `/api`。Vite 开发服务器会把 `/api` 和 `/uploads` 请求代理到这个地址；`VITE_BASE_API` 则是前端 API 请求使用的前缀。示例假设后端使用 `/api` 前缀和 8080 端口，如果你的 `server/config.yaml` 设置不同，请同步修改这些值以及 `vite.config.ts` 中的代理路径。

启动开发服务器：

```bash
npm run dev
```

目前 `vite.config.ts` 将开发服务器绑定到 `0.0.0.0:80`，通常可以通过 `http://localhost/` 访问。如果 80 端口已被占用，或系统不允许普通用户使用该端口，请将 `vite.config.ts` 中的 `server.port` 改为例如 `5173`，然后访问 `http://localhost:5173/`。修改环境变量后需要重启 Vite。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器，支持热更新 |
| `npm run type-check` | 检查 Vue 和 TypeScript 类型 |
| `npm run build` | 先进行类型检查，再生成生产构建 |
| `npm run build-only` | 只生成生产构建，不执行类型检查 |
| `npm run preview` | 本地预览已经生成的 `dist` 目录 |

生产文件输出到 `dist`（从最大仓库根目录看是 `web/dist`）。部署时由 Nginx 或其他静态文件服务器提供这些文件，并把 `/api` 和 `/uploads` 请求转发给后端。由于使用了 Vue Router 的 history 模式，静态服务器还需要把未命中的前端路由回退到 `index.html`。

## 目录说明

| 目录 | 内容 |
| --- | --- |
| `src/views` | 路由对应的页面，例如首页、文章详情、搜索页和后台页面 |
| `src/components` | 可复用组件，按布局、表单、通用组件和页面区块组织 |
| `src/api` | 前端调用的后端 API 函数和请求、响应类型 |
| `src/stores` | Pinia 状态，包括用户、网站信息、页面布局和后台标签 |
| `src/router` | Vue Router 路由定义及登录、管理员权限检查 |
| `src/assets` | 全局 CSS 等静态资源 |
| `src/utils/request.ts` | 共享 Axios 实例、访问令牌和统一错误处理 |
| `public` | 直接按 URL 提供的静态图片等资源 |

Vue 页面通常采用单文件组件：模板、`<script setup lang="ts">` 逻辑和样式放在同一个 `.vue` 文件中。样式多使用带作用域的 SCSS。

## 页面与权限

- `/`：博客首页。
- `/search`、`/news`、`/friend-link`、`/about`：搜索、新闻、友链和关于页面。
- `/article/:id`：文章详情及评论。
- `/login`：登录页面。
- `/dashboard`：后台。个人中心要求登录，用户管理、文章管理、图片管理和系统管理等页面要求管理员身份。

路由权限由 `src/router/index.ts` 中的 `requiresAuth` 和 `requiresAdmin` 元数据控制。服务端仍会独立检查 API 权限；前端路由检查不能替代后端鉴权。

## 前后端请求如何连接

页面从 `src/api` 中调用对应函数；这些函数使用 `src/utils/request.ts` 创建的 Axios 实例。实例会添加 `x-access-token` 请求头，并统一处理 `{ code, msg, data }` 格式的响应和错误。当前请求超时是 20 秒。

例如，文章搜索调用 `/article/search`。当 `VITE_BASE_API=/api` 时，浏览器访问 `/api/article/search`；开发环境由 Vite 代理到 `VITE_SERVER_URL`，生产环境则应由 Nginx 等反向代理转发。

`loading="lazy"` 用于列表等非首屏图片；首页主轮播只预载当前图片和下一张。通过 `<el-image src="...">` 加载的图片由浏览器直接请求，不经过 Axios。

Element Plus 组件和部分 API 会由 Vite 插件自动导入。`auto-imports.d.ts` 和 `components.d.ts` 是配套类型声明，通常不需要手工编辑。

## 修改页面时的建议顺序

1. 在 `src/router/index.ts` 确认页面路径和权限要求。
2. 在 `src/views` 中找到页面组件；需要复用的界面放到 `src/components`。
3. 在 `src/api` 中为后端接口编写有类型的调用函数，再由页面调用。
4. 如果请求未到后端，检查 `.env.local`、`VITE_BASE_API`、Vite 代理和后端 `router_prefix` 是否匹配。

不要把数据库密码、JWT 密钥、邮件密码或云存储密钥放进前端环境变量。以 `VITE_` 开头的值会进入浏览器构建产物，用户可以查看它们。
