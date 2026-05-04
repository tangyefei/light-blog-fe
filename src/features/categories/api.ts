import { request } from '@/lib/api-client'
import type { Category } from '@/types/category'

export function getCategories() {
  return request<Category[]>('/api/categories', { skipAuth: true })
}

