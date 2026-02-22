import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { cookies } from 'next/headers'
import { ThemeProvider } from 'next-themes'
import { AdminLayout } from './admin-layout'

export const metadata: Metadata = {
  title: 'Admin | MenuAI',
  description: 'Administration dashboard for MenuAI',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies()
  const hasAuth = Boolean(cookieStore.get('access_token')?.value)

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <style>{`
:root { --font-sans: ${GeistSans.style.fontFamily}; --font-mono: ${GeistMono.style.fontFamily}; }
        `}</style>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {hasAuth ? (
            <AdminLayout>{children}</AdminLayout>
          ) : (
            <main className="min-h-screen flex items-center justify-center p-6">{children}</main>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
