'use client'

import { useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, MAIN_APP_URL } from '@/lib/constants'
import { markAuthSyncDone } from '@/lib/auth-sync'

export function AuthBridge() {
  const queryClient = useQueryClient()
  const pathname = usePathname()

  useEffect(() => {
    if (window.parent === window) return

    function handleMessage(e: MessageEvent) {
      if (e.origin !== MAIN_APP_URL) return
      if (e.data?.type === 'AUTH_SYNC') {
        const { token, user } = e.data
        if (token) {
          localStorage.setItem(AUTH_TOKEN_KEY, token)
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY)
          localStorage.removeItem(AUTH_USER_KEY)
        }
        markAuthSyncDone()
        window.parent.postMessage({ type: 'AUTH_ACK' }, MAIN_APP_URL)
        queryClient.invalidateQueries()
      }
    }
    window.addEventListener('message', handleMessage)
    window.parent.postMessage({ type: 'AUTH_READY' }, MAIN_APP_URL)

    return () => window.removeEventListener('message', handleMessage)
  }, [queryClient])

  // Sync route changes to parent
  useEffect(() => {
    if (window.parent === window) return
    window.parent.postMessage(
      { type: 'ROUTE_CHANGE', path: pathname },
      MAIN_APP_URL,
    )
  }, [pathname])

  return null
}
