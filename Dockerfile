# syntax=docker/dockerfile:1

# -------------------------
# 依赖阶段：安装 npm 依赖
# -------------------------
FROM node:22-alpine AS deps

WORKDIR /app

# 先复制 lockfile，确保 npm ci 按锁定版本安装，构建结果更可复现。
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline --no-audit --progress=false

# -------------------------
# 构建阶段：编译 Next.js 应用
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# 复用依赖阶段安装好的 node_modules。
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* 会被 Next.js 注入到浏览器端代码。
# 这里设置默认值，compose 可以通过 build.args 覆盖。
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# 生成生产构建产物。next.config.ts 中的 output: 'standalone' 会输出可独立运行的 server.js。
RUN npm run build

# -------------------------
# 运行阶段：只复制 standalone 运行所需文件
# -------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 创建非 root 用户运行 Node 进程。
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# standalone 目录包含最小化后的服务端代码和必要依赖。
COPY --from=builder /app/.next/standalone ./

# 静态资源需要单独复制到 standalone 目录旁边，Next.js 才能正确返回 /_next/static。
COPY --from=builder /app/.next/static ./.next/static

# 如果未来添加 public 目录，这里会把静态公共资源一并带入镜像。
COPY --from=builder /app/public ./public

EXPOSE 3000

USER nextjs

# standalone 模式的入口文件。
CMD ["node", "server.js"]
