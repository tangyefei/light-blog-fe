import { request } from '@/lib/api-client'
import type { Tag } from '@/types/tag'

export function getTags() {
  return request<Tag[]>('/api/tags', { skipAuth: true })
}

export function createTag(name: string) {
  return request<number>('/api/tags/add', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

