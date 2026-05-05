import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // standalone 会把生产运行所需的 Next.js server 和依赖输出到 .next/standalone。
  // Docker 运行镜像只复制这部分内容，可以显著减小镜像体积。
  output: 'standalone',
}

export default nextConfig
