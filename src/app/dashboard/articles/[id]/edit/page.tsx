'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArticleEditor } from '@/components/article/article-editor'
import { Card, CardContent } from '@/components/ui/card'
import { getArticle, updateArticle } from '@/features/articles/api'
import { getCategories } from '@/features/categories/api'
import { getTags } from '@/features/tags/api'
import { toStatusCode } from '@/lib/utils'
import type { ArticleFormValues } from '@/types/article'

export default function EditArticlePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const articleQuery = useQuery({ queryKey: ['articles', params.id], queryFn: () => getArticle(params.id) })
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const tagsQuery = useQuery({ queryKey: ['tags'], queryFn: getTags })
  const mutation = useMutation({
    mutationFn: (values: ArticleFormValues) => updateArticle(params.id, values),
    onSuccess: () => {
      toast.success('文章已更新')
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      router.push(`/articles/${params.id}`)
    },
    onError: (error) => toast.error(error.message),
  })

  const article = articleQuery.data

  if (articleQuery.isLoading || categoriesQuery.isLoading || tagsQuery.isLoading) {
    return <State text="文章加载中..." />
  }

  if (!article) {
    return <State text="文章不存在或加载失败" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">编辑文章</h1>
        <p className="text-sm text-muted-foreground">更新内容后会覆盖当前文章字段。</p>
      </div>
      <ArticleEditor
        categories={categoriesQuery.data ?? []}
        tags={tagsQuery.data ?? []}
        defaultValues={{
          title: article.title,
          summary: article.summary ?? '',
          content: article.content,
          categoryId: article.categoryId,
          status: toStatusCode(article.status),
          tagIds: article.tags?.map((tag) => tag.id) ?? [],
        }}
        isSubmitting={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values)}
      />
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

