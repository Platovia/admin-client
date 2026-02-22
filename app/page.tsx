import { ArrowUpRight, Users, Building2, Store, PanelsTopLeft, BarChart3, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { serverApi } from '@/lib/server-api'
import Link from 'next/link'

async function getStats() {
  try {
    return await serverApi('/admin/stats')
  } catch {
    return null
  }
}

async function getRecentUsers() {
  try {
    const data = await serverApi('/admin/users?page_size=5&sort_by=created_at&sort_order=desc')
    return (data as any)?.users || []
  } catch {
    return []
  }
}

async function getRecentCompanies() {
  try {
    const data = await serverApi('/admin/companies?page_size=5&sort_by=created_at&sort_order=desc')
    return (data as any)?.companies || []
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const [stats, recentUsers, recentCompanies] = await Promise.all([
    getStats(),
    getRecentUsers(),
    getRecentCompanies(),
  ])

  const kpis = [
    { label: 'Users', value: (stats as any)?.users ?? '—', icon: Users, href: '/users' },
    { label: 'Companies', value: (stats as any)?.companies ?? '—', icon: Building2, href: '/companies' },
    { label: 'Restaurants', value: (stats as any)?.restaurants ?? '—', icon: Store, href: '/restaurants' },
    { label: 'Menus', value: (stats as any)?.menus ?? '—', icon: PanelsTopLeft, href: '/menus' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Platform overview and quick stats.</p>
        </div>
        <Link
          href="/analytics"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <BarChart3 className="h-4 w-4" /> View Analytics <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{kpi.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Recent Users</CardTitle>
            <Link href="/users" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((u: any) => (
                  <Link key={u.id} href={`/users/${u.id}`} className="flex items-center justify-between text-sm hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md">
                    <div>
                      <span className="font-medium">{u.first_name} {u.last_name}</span>
                      <span className="text-muted-foreground ml-2">{u.email}</span>
                    </div>
                    <Badge variant={u.is_active ? "success" : "secondary"} className="text-xs">
                      {u.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No users yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Recent Companies</CardTitle>
            <Link href="/companies" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentCompanies.length > 0 ? (
              <div className="space-y-3">
                {recentCompanies.map((c: any) => (
                  <Link key={c.id} href={`/companies/${c.id}`} className="flex items-center justify-between text-sm hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md">
                    <div>
                      <span className="font-medium">{c.name}</span>
                      <Badge variant={c.subscription_tier === "paid" ? "info" : "secondary"} className="ml-2 text-xs">
                        {c.subscription_tier}
                      </Badge>
                    </div>
                    <Badge variant={c.is_active ? "success" : "secondary"} className="text-xs">
                      {c.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No companies yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
