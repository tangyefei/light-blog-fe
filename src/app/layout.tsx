import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { AppHeader } from '@/components/app/app-header'

export const metadata: Metadata = {
  title: 'Light Blog',
  description: 'A lightweight blog frontend for light-blog-api',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>
          <AppHeader />
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

