# light-blog-fe 前端实现规划

## 1. 项目目标

`light-blog-fe` 作为 `light-blog-api` 的 Web 前端，负责提供博客浏览、用户认证、文章管理、分类标签筛选等能力。

技术栈：

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- TanStack Query
- next-themes
- react-markdown 或 Markdown 编辑器组件

## 2. 后端接口事实

后端统一响应结构：

```ts
type ApiResult<T> = {
  code: number
  message: string
  data: T
}
```

成功响应 `code = 200`，失败响应可能为 `400`、`401`、`403`、`404`、`409`、`500`。

认证方式：

- 登录成功返回 `token`
- 需要在请求头携带 `Authorization: Bearer ${token}`
- 当前后端拦截器只放行：
  - `POST /api/users/login`
  - `POST /api/users/register`
  - Swagger / Knife4j 文档路径

因此目前 `GET /api/articles/page`、`GET /api/articles/{id}`、`GET /api/categories`、`GET /api/tags` 也都需要登录才能访问。若希望博客首页和文章详情对游客开放，需要调整后端白名单。

## 3. 页面与路由规划

采用 Next.js App Router：

```txt
src/app
├── layout.tsx
├── page.tsx                         # 文章首页
├── login/page.tsx                    # 登录
├── register/page.tsx                 # 注册
├── articles/[id]/page.tsx            # 文章详情
├── dashboard/layout.tsx              # 登录后管理区布局
├── dashboard/page.tsx                # 管理区概览
├── dashboard/articles/page.tsx       # 我的文章
├── dashboard/articles/new/page.tsx   # 新建文章
├── dashboard/articles/[id]/edit/page.tsx
└── dashboard/tags/page.tsx           # 标签管理
```

第一阶段优先实现：

1. 登录、注册
2. 文章列表
3. 文章详情
4. 我的文章
5. 新建、编辑、删除文章
6. 标签新增

分类接口当前只有查询能力，没有新增、修改、删除接口，所以前端先只做筛选和选择，不做分类管理。

## 4. 功能模块规划

### 4.1 认证模块

接口：

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me`

前端职责：

- 登录表单：`account`、`password`
- 注册表单：`username`、`email`、`password`
- 登录成功后保存 token 和用户信息
- 请求自动携带 Authorization
- 遇到 `401` 自动清理登录状态并跳转 `/login`

建议实现：

- token 存储在 `localStorage`
- 用户信息存储在 React context 或 Zustand
- 页面刷新后通过 `/api/users/me` 恢复当前用户

### 4.2 文章浏览模块

接口：

- `GET /api/articles/page`
- `GET /api/articles/{id}`
- `GET /api/categories`
- `GET /api/tags`

文章列表查询参数：

```ts
type ArticleQuery = {
  pageNum?: number
  pageSize?: number
  title?: string
  categoryId?: number
  tagId?: number
  status?: 0 | 1
}
```

列表页能力：

- 标题搜索
- 分类筛选
- 标签筛选
- 分页
- 展示标题、摘要、作者、标签、浏览量、创建时间

文章详情页能力：

- 展示标题、作者、创建时间、更新时间、浏览量、标签
- 渲染 Markdown 内容
- 登录用户如果是作者，可显示编辑入口

注意：后端 `getById` 会增加浏览量，详情页不要重复请求同一文章。

### 4.3 文章管理模块

接口：

- `GET /api/articles/mine`
- `POST /api/articles/add`
- `PUT /api/articles/{id}`
- `DELETE /api/articles/{id}`

文章表单字段：

```ts
type ArticleFormValues = {
  title: string
  summary?: string
  content: string
  categoryId: number
  status: 0 | 1
  tagIds: number[]
}
```

管理页能力：

- 我的文章列表
- 按标题、分类、状态筛选
- 新建文章
- 编辑文章
- 删除文章二次确认
- 草稿 / 发布状态切换

编辑文章时：

- 通过 `GET /api/articles/{id}` 拉取初始数据
- 将后端返回的 `tags: Tag[]` 转成 `tagIds: number[]`
- 提交时完整传递表单字段，避免后端部分更新语义造成字段被置空

### 4.4 分类标签模块

分类：

- `GET /api/categories`
- 只作为筛选项和文章表单选择项

标签：

- `GET /api/tags`
- `POST /api/tags/add`

标签管理页能力：

- 展示全部标签
- 新增标签
- 新增成功后刷新标签列表

## 5. 目录结构规划

```txt
light-blog-fe
├── src
│   ├── app
│   ├── components
│   │   ├── app
│   │   ├── article
│   │   ├── auth
│   │   └── ui
│   ├── features
│   │   ├── articles
│   │   ├── auth
│   │   ├── categories
│   │   └── tags
│   ├── lib
│   │   ├── api-client.ts
│   │   ├── auth-store.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── types
│       ├── api.ts
│       ├── article.ts
│       ├── category.ts
│       ├── tag.ts
│       └── user.ts
├── components.json
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

分层原则：

- `src/app` 只组织路由和页面布局
- `src/components/ui` 放 shadcn/ui 生成组件
- `src/components/article`、`src/components/auth` 放可复用视图组件
- `src/features/*` 放接口 hooks、表单 schema、业务组件
- `src/lib/api-client.ts` 统一处理请求、token、错误
- `src/types` 映射后端 DTO / VO / Entity

## 6. API 封装规划

环境变量：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

核心封装：

```ts
async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T>
```

行为要求：

- 自动拼接 `NEXT_PUBLIC_API_BASE_URL`
- 自动设置 `Content-Type: application/json`
- 自动读取 token 并设置 `Authorization`
- 解析 `ApiResult<T>`
- `code !== 200` 时抛出业务错误
- `401` 时清理 token

建议按资源拆分：

```txt
features/auth/api.ts
features/articles/api.ts
features/categories/api.ts
features/tags/api.ts
```

## 7. 类型映射

```ts
type ArticleStatus = 0 | 1

type User = {
  id: number
  username: string
  email: string
  avatar?: string | null
  createdAt?: string
  updatedAt?: string
}

type Category = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

type Tag = {
  id: number
  name: string
  createdAt: string
}

type Article = {
  id: number
  title: string
  summary?: string | null
  content: string
  contentHtml?: string | null
  views: number
  categoryId: number
  userId: number
  createdAt: string
  updatedAt: string
  status: 'DRAFT' | 'PUBLISH' | 0 | 1
  deleted?: boolean
  tags: Tag[]
  userName?: string
}
```

后端 `Article.status` 是枚举字段，MyBatis-Plus 查询条件使用 `0/1`，但 JSON 序列化实际可能返回枚举名或对象，前端实现时需要先通过真实接口确认。如果返回不是 `0/1`，建议后端在响应 VO 中统一转成数字状态。

## 8. UI 规划

整体风格：

- 管理型博客后台，界面保持克制、清晰、信息密度适中
- 首页偏内容阅读，不做营销页
- shadcn/ui 负责基础组件一致性

核心组件：

- `AppHeader`
- `UserMenu`
- `ArticleCard`
- `ArticleFilters`
- `ArticlePagination`
- `ArticleEditor`
- `MarkdownPreview`
- `StatusBadge`
- `ConfirmDeleteDialog`
- `TagSelector`
- `CategorySelect`

shadcn/ui 优先引入：

- button
- input
- textarea
- form
- select
- badge
- card
- dialog
- dropdown-menu
- avatar
- tabs
- table
- pagination
- sonner
- skeleton

## 9. 表单校验

使用 Zod 对齐后端约束：

- 注册用户名：2-20 字符
- 注册密码：6-50 字符
- 邮箱：合法邮箱
- 登录账号、密码：必填
- 标签名：必填，最多 50 字符
- 文章标题：必填，最多建议 200 字符
- 摘要：最多建议 500 字符
- 正文：必填
- 分类：必选
- 状态：`0 | 1`

## 10. 里程碑

### M1：项目基础设施

- 初始化 Next.js + TypeScript + Tailwind CSS
- 接入 shadcn/ui
- 建立目录结构
- 建立 API client、类型定义、全局 layout
- 配置 `NEXT_PUBLIC_API_BASE_URL`

### M2：认证闭环

- 登录页
- 注册页
- token 持久化
- `/api/users/me` 恢复登录态
- 受保护路由
- `401` 统一处理

### M3：内容浏览

- 分类、标签加载
- 文章列表
- 搜索和筛选
- 分页
- 文章详情
- Markdown 渲染

### M4：文章管理

- 我的文章列表
- 新建文章
- 编辑文章
- 删除文章
- 草稿 / 发布
- 成功、失败 toast

### M5：标签管理和体验补齐

- 标签列表
- 新增标签
- loading / empty / error 状态
- 基础响应式适配
- 表单脏数据离开提示

## 11. 需要和后端确认或调整的问题

1. 公开访问策略

   如果博客首页和文章详情需要游客访问，后端应放行：

   - `GET /api/articles/page`
   - `GET /api/articles/{id}`
   - `GET /api/categories`
   - `GET /api/tags`

2. 文章状态 JSON 格式

   前端需要确认 `Article.status` 实际返回值。推荐后端响应统一返回 `0 | 1`，并额外返回展示文案。

3. 用户信息脱敏

   `GET /api/users/me` 当前返回 `User` 实体，可能包含 `password` 字段。建议后端改为 `UserResponseVo`，不要返回密码。

4. 分类管理

   当前没有分类新增、修改、删除接口。前端第一版不做分类管理。

5. 文章公开列表是否只展示已发布

   当前 `GET /api/articles/page` 可按 `status` 查询，但不传时会返回所有状态。若首页面向游客，建议后端默认只返回已发布文章，或前端固定传 `status=1`。

## 12. 推荐默认实现决策

- 首页文章列表固定传 `status=1`
- 管理区文章列表调用 `/api/articles/mine`
- token 先使用 `localStorage`，后续再考虑 HttpOnly Cookie
- 文章编辑器第一版使用 Markdown 文本框 + 预览，避免引入过重编辑器
- 所有数据请求使用 TanStack Query，表单提交成功后通过 query invalidation 刷新列表
- 删除、发布、保存等操作统一使用 shadcn dialog 和 sonner toast

