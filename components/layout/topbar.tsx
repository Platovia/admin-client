"use client"

import { Search } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="h-14 px-6 flex items-center justify-between">
        <h1 className="text-sm font-medium text-muted-foreground">Admin Dashboard</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Search"
            placeholder="Search..."
            className="pl-9 pr-3 py-2 rounded-md text-sm bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </header>
  )
}
