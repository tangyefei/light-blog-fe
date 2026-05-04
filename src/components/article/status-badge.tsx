import { Badge } from '@/components/ui/badge'
import { statusLabel, toStatusCode } from '@/lib/utils'

export function StatusBadge({ status }: { status: unknown }) {
  const published = toStatusCode(status) === 1
  return <Badge variant={published ? 'default' : 'secondary'}>{statusLabel(status)}</Badge>
}

