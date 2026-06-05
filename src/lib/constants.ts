export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8081')
export const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_APP_URL ?? (process.env.NODE_ENV === 'production' ? 'https://groundedglow.cc' : 'http://localhost:3000')
export const AUTH_TOKEN_KEY = 'light_blog_token'
export const AUTH_USER_KEY = 'light_blog_user'
