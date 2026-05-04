import { request, toQueryString } from '@/lib/api-client'
import type { Article, ArticleFormValues, ArticleQuery } from '@/types/article'
import type { PageResult } from '@/types/api'

export function getArticles(query: ArticleQuery = {}) {
  return request<PageResult<Article>>(`/api/articles/page${toQueryString(query)}`, { skipAuth: true })
}

export function getMyArticles(query: ArticleQuery = {}) {
  return request<PageResult<Article>>(`/api/articles/mine${toQueryString(query)}`)
}

export function getArticle(id: number | string) {
  return request<Article>(`/api/articles/${id}`, { skipAuth: true })
}

export function createArticle(payload: ArticleFormValues) {
  return request<number>('/api/articles/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateArticle(id: number | string, payload: ArticleFormValues) {
  return request<void>(`/api/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteArticle(id: number | string) {
  return request<void>(`/api/articles/${id}`, {
    method: 'DELETE',
  })
}

