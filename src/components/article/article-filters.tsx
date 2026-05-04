'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { Category } from '@/types/category'
import type { Tag } from '@/types/tag'

type Props = {
  title: string
  categoryId: string
  tagId?: string
  status?: string
  categories: Category[]
  tags?: Tag[]
  showStatus?: boolean
  onChange: (values: { title: string; categoryId: string; tagId?: string; status?: string }) => void
}

export function ArticleFilters({
  title,
  categoryId,
  tagId = '',
  status = '',
  categories,
  tags = [],
  showStatus,
  onChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_180px_180px_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={title}
          onChange={(event) => onChange({ title: event.target.value, categoryId, tagId, status })}
          placeholder="搜索标题"
          className="pl-9"
        />
      </div>
      <Select value={categoryId} onChange={(event) => onChange({ title, categoryId: event.target.value, tagId, status })}>
        <option value="">全部分类</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      {showStatus ? (
        <Select value={status} onChange={(event) => onChange({ title, categoryId, tagId, status: event.target.value })}>
          <option value="">全部状态</option>
          <option value="1">已发布</option>
          <option value="0">草稿</option>
        </Select>
      ) : (
        <Select value={tagId} onChange={(event) => onChange({ title, categoryId, tagId: event.target.value, status })}>
          <option value="">全部标签</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </Select>
      )}
      <Button type="button" variant="outline" onClick={() => onChange({ title: '', categoryId: '', tagId: '', status: '' })}>
        重置
      </Button>
    </div>
  )
}

