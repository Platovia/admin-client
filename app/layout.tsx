import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Sidebar from '@/components/layout/sidebar'
import Topbar from '@/components/layout/topbar'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Admin | MenuAI',
  description: 'Administration dashboard for MenuAI',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies()
  const hasAuth = Boolean(cookieStore.get('access_token')?.value)

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <style>{`
:root { --font-sans: ${GeistSans.style.fontFamily}; --font-mono: ${GeistMono.style.fontFamily}; }
        `}</style>
      </head>
      <body className="font-sans antialiased">
        {hasAuth ? (
          <div className="min-h-screen grid grid-cols-[240px_1fr] bg-background text-foreground">
            <aside className="border-r border-border"><Sidebar /></aside>
            <div className="flex flex-col min-h-screen">
              <Topbar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        ) : (
          <main className="min-h-screen flex items-center justify-center p-6">{children}</main>
        )}
      </body>
    </html>
  )
}
