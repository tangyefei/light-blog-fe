'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownPreview } from './markdown-preview'
import { articleSchema } from '@/features/articles/schemas'
import type { ArticleFormValues } from '@/types/article'
import type { Category } from '@/types/category'
import type { Tag } from '@/types/tag'

type Props = {
  defaultValues?: ArticleFormValues
  categories: Category[]
  tags: Tag[]
  isSubmitting?: boolean
  onSubmit: (values: ArticleFormValues) => void
}

const emptyValues: ArticleFormValues = {
  title: '',
  summary: '',
  content: '',
  categoryId: 0,
  status: 0,
  tagIds: [],
}

export function ArticleEditor({ defaultValues, categories, tags, isSubmitting, onSubmit }: Props) {
  const values = useMemo(() => defaultValues ?? emptyValues, [defaultValues])
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    values,
  })

  const selectedTagIds = watch('tagIds') ?? []
  const content = watch('content') ?? ''

  function toggleTag(tagId: number) {
    if (selectedTagIds.includes(tagId)) {
      setValue(
        'tagIds',
        selectedTagIds.filter((id) => id !== tagId),
        { shouldDirty: true },
      )
    } else {
      setValue('tagIds', [...selectedTagIds, tagId], { shouldDirty: true })
    }
  }

  return (
    <form className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>文章内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="标题" error={errors.title?.message}>
            <Input {...register('title')} placeholder="输入文章标题" />
          </Field>
          <Field label="摘要" error={errors.summary?.message}>
            <Textarea {...register('summary')} placeholder="用于文章列表展示，可选" className="min-h-24" />
          </Field>
          <Field label="正文 Markdown" error={errors.content?.message}>
            <Textarea {...register('content')} placeholder="开始写作..." className="min-h-[420px] font-mono" />
          </Field>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>发布设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="分类" error={errors.categoryId?.message}>
              <Select {...register('categoryId', { valueAsNumber: true })}>
                <option value={0}>请选择分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="状态" error={errors.status?.message}>
              <Select {...register('status', { valueAsNumber: true })}>
                <option value={0}>草稿</option>
                <option value={1}>发布</option>
              </Select>
            </Field>
            <div className="space-y-2">
              <Label>标签</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const checked = selectedTagIds.includes(tag.id)
                  return (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={checked ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Button>
                  )
                })}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? '保存中...' : '保存文章'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>预览</CardTitle>
          </CardHeader>
          <CardContent>
            {content ? <MarkdownPreview content={content} /> : <p className="text-sm text-muted-foreground">正文预览将在这里显示</p>}
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

