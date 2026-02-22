"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Building2, Store, PanelsTopLeft,
  BadgeCheck, Settings, FileStack, ImageUp, BarChart3,
  Shield, MessageSquare, QrCode, Globe, CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: any
}

interface NavSection {
  title: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: "Core",
    items: [
      { href: '/users', label: 'Users', icon: Users },
      { href: '/companies', label: 'Companies', icon: Building2 },
      { href: '/restaurants', label: 'Restaurants', icon: Store },
      { href: '/menus', label: 'Menus', icon: PanelsTopLeft },
      { href: '/roles', label: 'Roles', icon: Shield },
    ],
  },
  {
    title: "Content",
    items: [
      { href: '/ocr-jobs', label: 'OCR Jobs', icon: FileStack },
      { href: '/sources', label: 'Sources', icon: Globe },
      { href: '/embeddings', label: 'Embeddings', icon: ImageUp },
    ],
  },
  {
    title: "Engagement",
    items: [
      { href: '/chat-sessions', label: 'Chat Sessions', icon: MessageSquare },
      { href: '/qr-tokens', label: 'QR Tokens', icon: QrCode },
    ],
  },
  {
    title: "System",
    items: [
      { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="h-full p-4 bg-sidebar text-sidebar-foreground overflow-y-auto">
      <div className="mb-6 px-2">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <BadgeCheck className="h-5 w-5 text-sidebar-primary" />
          Admin
        </Link>
      </div>
      <nav className="space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
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
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
