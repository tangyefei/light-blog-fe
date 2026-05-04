'use client'

import { useQuery } from '@tanstack/react-query'
import { FileText, Tags } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMyArticles } from '@/features/articles/api'
import { getTags } from '@/features/tags/api'
import { useAuth } from '@/features/auth/use-auth'

export default function DashboardPage() {
  const { user } = useAuth()
  const articlesQuery = useQuery({ queryKey: ['articles', 'mine', 'summary'], queryFn: () => getMyArticles({ pageNum: 1, pageSize: 1 }) })
  const tagsQuery = useQuery({ queryKey: ['tags'], queryFn: getTags })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">工作台</h1>
          <p className="text-sm text-muted-foreground">{user?.username ?? '作者'}，这里是你的博客管理入口。</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articles/new">新建文章</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard title="我的文章" value={articlesQuery.data?.total ?? 0} icon={<FileText className="h-5 w-5" />} />
        <MetricCard title="标签数量" value={tagsQuery.data?.length ?? 0} icon={<Tags className="h-5 w-5" />} />
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

