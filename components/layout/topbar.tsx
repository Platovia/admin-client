"use client"

import { Search, LogOut, Moon, Sun, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  onToggleSidebar?: () => void
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  function logout() {
    document.cookie = 'access_token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/;'
    document.cookie = 'refresh_token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/;'
    window.location.href = '/login'
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-sm font-medium text-muted-foreground hidden sm:block">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              aria-label="Search"
              placeholder="Search..."
              className="pl-9 pr-3 py-2 rounded-md text-sm bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring w-48 lg:w-64"
            />
          </div>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={logout} className="gap-1.5">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
