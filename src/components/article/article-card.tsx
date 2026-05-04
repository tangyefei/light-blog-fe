import { Eye } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from './status-badge'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/types/article'

export function ArticleCard({ article, showStatus = false }: { article: Article; showStatus?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-base sm:text-lg">
            <Link href={`/articles/${article.id}`} className="hover:text-primary">
              {article.title}
            </Link>
          </CardTitle>
          {showStatus ? <StatusBadge status={article.status} /> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {article.summary || '暂无摘要'}
        </p>
        <div className="flex flex-wrap gap-2">
          {article.tags?.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{article.userName ?? '未知作者'}</span>
          <span>{formatDate(article.createdAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.views ?? 0}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

