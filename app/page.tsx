import { ArrowUpRight, Users, Building2, UtensilsCrossed, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getMe() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const res = await fetch(`${apiBase}/auth/me`, { cache: 'no-store', headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {
  const me = await getMe()
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">Signed in as {me?.email || '—'}</div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Restaurants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">124</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> 3.1% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">2,341</div>
            <p className="text-xs text-muted-foreground mt-1">+58 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Menus Processed</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">876</div>
            <p className="text-xs text-muted-foreground mt-1">+12 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">No incidents</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Action</th>
                  <th className="text-left p-3 font-medium">Target</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { t: '10:22', u: 'alice', a: 'Approved menu', tgt: 'Resto #54' },
                  { t: '10:05', u: 'bob', a: 'Updated tags', tgt: 'Menu Item #332' },
                  { t: '09:44', u: 'eve', a: 'Restarted OCR job', tgt: 'Job #88421' },
                ].map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 text-muted-foreground">{row.t}</td>
                    <td className="p-3">{row.u}</td>
                    <td className="p-3">{row.a}</td>
                    <td className="p-3">{row.tgt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
