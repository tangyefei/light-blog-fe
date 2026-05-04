'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArticleCard } from '@/components/article/article-card'
import { ArticleFilters } from '@/components/article/article-filters'
import { Pagination } from '@/components/article/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteArticle, getMyArticles } from '@/features/articles/api'
import { getCategories } from '@/features/categories/api'

export default function MyArticlesPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ title: '', categoryId: '', status: '' })

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const articlesQuery = useQuery({
    queryKey: ['articles', 'mine', page, filters],
    queryFn: () =>
      getMyArticles({
        pageNum: page,
        pageSize: 10,
        title: filters.title || undefined,
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
        status: filters.status === '' ? undefined : filters.status === '1' ? 1 : 0,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast.success('文章已删除')
      queryClient.invalidateQueries({ queryKey: ['articles', 'mine'] })
    },
    onError: (error) => toast.error(error.message),
  })

  const articles = articlesQuery.data?.records ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">我的文章</h1>
          <p className="text-sm text-muted-foreground">管理草稿和已发布内容。</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articles/new">
            <Plus className="h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <ArticleFilters
        title={filters.title}
        categoryId={filters.categoryId}
        status={filters.status}
        categories={categoriesQuery.data ?? []}
        showStatus
        onChange={(values) => {
          setFilters({ title: values.title, categoryId: values.categoryId, status: values.status ?? '' })
          setPage(1)
        }}
      />

      {articlesQuery.isLoading ? (
        <State text="文章加载中..." />
      ) : articlesQuery.isError ? (
        <State text="文章加载失败" />
      ) : articles.length === 0 ? (
        <State text="还没有文章" />
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div key={article.id} className="space-y-3 rounded-lg border bg-background p-3">
              <ArticleCard article={article} showStatus />
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/articles/${article.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    编辑
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (window.confirm('确认删除这篇文章？')) {
                      deleteMutation.mutate(article.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination current={articlesQuery.data?.current ?? page} pages={articlesQuery.data?.pages ?? 0} onChange={setPage} />
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

