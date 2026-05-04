'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArticleCard } from '@/components/article/article-card'
import { ArticleFilters } from '@/components/article/article-filters'
import { Pagination } from '@/components/article/pagination'
import { Card, CardContent } from '@/components/ui/card'
import { getArticles } from '@/features/articles/api'
import { getCategories } from '@/features/categories/api'
import { getTags } from '@/features/tags/api'

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ title: '', categoryId: '', tagId: '' })

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const tagsQuery = useQuery({ queryKey: ['tags'], queryFn: getTags })
  const articlesQuery = useQuery({
    queryKey: ['articles', 'public', page, filters],
    queryFn: () =>
      getArticles({
        pageNum: page,
        pageSize: 10,
        title: filters.title || undefined,
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
        tagId: filters.tagId ? Number(filters.tagId) : undefined,
        status: 1,
      }),
  })

  const articles = articlesQuery.data?.records ?? []

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-normal">文章</h1>
        <p className="text-sm text-muted-foreground">浏览已发布内容，按标题、分类和标签快速筛选。</p>
      </div>

      <ArticleFilters
        title={filters.title}
        categoryId={filters.categoryId}
        tagId={filters.tagId}
        categories={categoriesQuery.data ?? []}
        tags={tagsQuery.data ?? []}
        onChange={(values) => {
          setFilters({ title: values.title, categoryId: values.categoryId, tagId: values.tagId ?? '' })
          setPage(1)
        }}
      />

      {articlesQuery.isLoading ? (
        <ListState text="文章加载中..." />
      ) : articlesQuery.isError ? (
        <ListState text="文章加载失败，请确认后端服务已启动。" />
      ) : articles.length === 0 ? (
        <ListState text="暂无文章" />
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <Pagination current={articlesQuery.data?.current ?? page} pages={articlesQuery.data?.pages ?? 0} onChange={setPage} />
    </div>
  )
}

function ListState({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center text-sm text-muted-foreground">{text}</CardContent>
    </Card>
  )
}

