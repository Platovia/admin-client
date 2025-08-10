"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Building2, Store, PanelsTopLeft, BadgeCheck, Settings, FileStack, ImageUp } from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/restaurants', label: 'Restaurants', icon: Store },
  { href: '/menus', label: 'Menus', icon: PanelsTopLeft },
  { href: '/ocr-jobs', label: 'OCR Jobs', icon: FileStack },
  { href: '/embeddings', label: 'Embeddings', icon: ImageUp },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="h-full p-4 bg-sidebar text-sidebar-foreground">
      <div className="mb-6 px-2">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <BadgeCheck className="h-5 w-5 text-sidebar-primary" />
          Admin
        </Link>
      </div>
      <nav className="space-y-1">
        {nav.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
