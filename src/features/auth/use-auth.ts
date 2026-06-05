'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser } from './api'
import { clearStoredAuth, getStoredUser, storeUser } from '@/lib/auth-store'
import { MAIN_APP_URL } from '@/lib/constants'

export function useAuth() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const user = await getCurrentUser()
        storeUser(user)
        return user
      } catch {
        return null
      }
    },
    initialData: getStoredUser() ?? undefined,
    retry: false,
  })

  function logout() {
    clearStoredAuth()
    queryClient.setQueryData(['auth', 'me'], null)
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'AUTH_EXPIRED' }, MAIN_APP_URL)
    } else {
      window.location.href = `${MAIN_APP_URL}/login?redirect=${encodeURIComponent(window.location.origin)}`
    }
  }

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isLoggedIn: Boolean(query.data),
    logout,
  }
}
