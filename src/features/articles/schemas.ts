import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().min(1, '请输入标题').max(200, '标题最多 200 个字符'),
  summary: z.string().max(500, '摘要最多 500 个字符').optional(),
  content: z.string().min(1, '请输入正文'),
  categoryId: z.coerce.number().min(1, '请选择分类'),
  status: z.union([z.literal(0), z.literal(1)], { required_error: '请选择状态' }),
  tagIds: z.array(z.number()),
})
