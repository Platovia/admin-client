import { ArrowUpRight, Users, Building2, UtensilsCrossed, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getStats() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const res = await fetch(`${apiBase}/admin/stats`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {
  const stats = await getStats()
  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.users ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.companies ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.restaurants ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Menus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.menus ?? '—'}</div>
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
