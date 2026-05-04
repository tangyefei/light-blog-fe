'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTag, getTags } from '@/features/tags/api'

const schema = z.object({
  name: z.string().min(1, '请输入标签名').max(50, '标签最多 50 个字符'),
})

type FormValues = z.infer<typeof schema>

export default function TagsPage() {
  const queryClient = useQueryClient()
  const tagsQuery = useQuery({ queryKey: ['tags'], queryFn: getTags })
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })
  const mutation = useMutation({
    mutationFn: (values: FormValues) => createTag(values.name),
    onSuccess: () => {
      toast.success('标签已新增')
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">标签</h1>
        <p className="text-sm text-muted-foreground">维护文章标签，供文章筛选和编辑时使用。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新增标签</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <div className="flex-1 space-y-2">
              <Label>标签名</Label>
              <Input {...form.register('name')} placeholder="例如 Spring Boot" />
              {form.formState.errors.name?.message ? <p className="text-sm text-destructive">{form.formState.errors.name.message}</p> : null}
            </div>
            <Button type="submit" className="sm:mt-7" disabled={mutation.isPending}>
              <Plus className="h-4 w-4" />
              新增
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>全部标签</CardTitle>
        </CardHeader>
        <CardContent>
          {tagsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">标签加载中...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(tagsQuery.data ?? []).map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

