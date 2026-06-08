'use client'

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from './constants'
import type { LoginResponse, User } from '@/types/user'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

// On standalone load (not iframe), sync cookie → localStorage
if (typeof window !== 'undefined' && window.parent === window) {
  const cookieToken = getCookie(AUTH_TOKEN_KEY)
  const cookieUser = getCookie(AUTH_USER_KEY)
  if (cookieToken && !window.localStorage.getItem(AUTH_TOKEN_KEY)) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, cookieToken)
    if (cookieUser) {
      window.localStorage.setItem(AUTH_USER_KEY, cookieUser)
    }
  }
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function storeLogin(response: LoginResponse) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, response.token)
  window.localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      id: response.id,
      username: response.username,
      email: response.email,
      avatar: response.avatar,
    }),
  )
}

export function storeUser(user: User) {
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
  window.localStorage.removeItem(AUTH_USER_KEY)
}
