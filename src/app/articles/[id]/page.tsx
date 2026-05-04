'use client'

import { useQuery } from '@tanstack/react-query'
import { Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MarkdownPreview } from '@/components/article/markdown-preview'
import { getArticle } from '@/features/articles/api'
import { useAuth } from '@/features/auth/use-auth'
import { formatDate } from '@/lib/utils'

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>()
  const { user } = useAuth()
  const articleQuery = useQuery({
    queryKey: ['articles', params.id],
    queryFn: () => getArticle(params.id),
  })

  const article = articleQuery.data

  if (articleQuery.isLoading) {
    return <State text="文章加载中..." />
  }

  if (articleQuery.isError || !article) {
    return <State text="文章不存在或加载失败" />
  }

  const canEdit = user?.id === article.userId

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.tags?.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-normal">{article.title}</h1>
          {canEdit ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/articles/${article.id}/edit`}>
                <Pencil className="h-4 w-4" />
                编辑
              </Link>
            </Button>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{article.userName ?? '未知作者'}</span>
          <span>{formatDate(article.createdAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {article.views ?? 0}
          </span>
        </div>
        {article.summary ? <p className="rounded-lg bg-muted p-4 text-sm leading-6">{article.summary}</p> : null}
      </div>

      <MarkdownPreview content={article.content} />
    </div>
  )
}

function State({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center text-sm text-muted-foreground">{text}</CardContent>
    </Card>
  )
}

