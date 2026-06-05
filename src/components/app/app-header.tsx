'use client'

import { BookOpen, LogIn, Moon, PenLine, Sun, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/use-auth'
import { MAIN_APP_URL } from '@/lib/constants'

function goToLogin() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'AUTH_EXPIRED' }, MAIN_APP_URL)
  } else {
    window.location.href = `${MAIN_APP_URL}/login?redirect=${encodeURIComponent(window.location.href)}`
  }
}

export function AppHeader() {
  const { theme, setTheme } = useTheme()
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          Light Blog
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {isLoggedIn ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/articles">
                  <PenLine className="h-4 w-4" />
                  <span className="hidden sm:inline">写作</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <UserRound className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.username ?? '我的'}</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                退出
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={goToLogin}>
              <LogIn className="h-4 w-4" />
              登录
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="切换主题"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
