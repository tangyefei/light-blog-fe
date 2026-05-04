'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArticleEditor } from '@/components/article/article-editor'
import { Card, CardContent } from '@/components/ui/card'
import { createArticle } from '@/features/articles/api'
import { getCategories } from '@/features/categories/api'
import { getTags } from '@/features/tags/api'
import type { ArticleFormValues } from '@/types/article'

export default function NewArticlePage() {
  const router = useRouter()
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const tagsQuery = useQuery({ queryKey: ['tags'], queryFn: getTags })
  const mutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (id) => {
      toast.success('文章已保存')
      router.push(`/articles/${id}`)
    },
    onError: (error) => toast.error(error.message),
  })

  if (categoriesQuery.isLoading || tagsQuery.isLoading) {
    return <State text="编辑器加载中..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">新建文章</h1>
        <p className="text-sm text-muted-foreground">使用 Markdown 编写正文，保存为草稿或直接发布。</p>
      </div>
      <ArticleEditor
        categories={categoriesQuery.data ?? []}
        tags={tagsQuery.data ?? []}
        isSubmitting={mutation.isPending}
        onSubmit={(values: ArticleFormValues) => mutation.mutate(values)}
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

