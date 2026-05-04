'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Pagination({
  current,
  pages,
  onChange,
}: {
  current: number
  pages: number
  onChange: (page: number) => void
}) {
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3">
      <Button variant="outline" size="sm" disabled={current <= 1} onClick={() => onChange(current - 1)}>
        <ChevronLeft className="h-4 w-4" />
        上一页
      </Button>
      <span className="text-sm text-muted-foreground">
        第 {current} / {pages} 页
      </span>
      <Button variant="outline" size="sm" disabled={current >= pages} onClick={() => onChange(current + 1)}>
        下一页
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

