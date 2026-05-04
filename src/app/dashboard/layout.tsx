'use client'

import { FileText, LayoutDashboard, Tags } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/use-auth'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: '概览', icon: LayoutDashboard },
  { href: '/dashboard/articles', label: '我的文章', icon: FileText },
  { href: '/dashboard/tags', label: '标签', icon: Tags },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return (
    <div className="grid gap-6 md:grid-cols-[190px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-20 md:h-fit">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Button key={item.href} asChild variant={active ? 'secondary' : 'ghost'} className={cn('justify-start', active && 'font-semibold')}>
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  )
}

