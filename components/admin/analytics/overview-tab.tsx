"use client"

import { useState, useEffect } from "react"
import { KpiCard } from "./kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { PeriodSelector } from "./period-selector"

const registrationConfig = {
  users: { label: "Users", color: "hsl(var(--chart-1))" },
  companies: { label: "Companies", color: "hsl(var(--chart-2))" },
  restaurants: { label: "Restaurants", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function OverviewTab() {
  const [overview, setOverview] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any>(null)
  const [period, setPeriod] = useState("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch("/api/admin/analytics/overview").then((r) => r.json()),
      fetch(`/api/admin/analytics/registrations?period=${period}`).then((r) => r.json()),
    ]).then(([o, r]) => {
      setOverview(o)
      setRegistrations(r)
    }).finally(() => setLoading(false))
  }, [period])

  if (loading) return <div className="flex justify-center py-12"><Spinner size={24} /></div>
  if (!overview) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Users" value={overview.users?.total || 0} subtitle={`${overview.users?.active || 0} active`} />
        <KpiCard title="Companies" value={overview.companies?.total || 0} subtitle={`${overview.companies?.active || 0} active`} />
        <KpiCard title="Restaurants" value={overview.restaurants?.total || 0} subtitle={`${overview.restaurants?.active || 0} active`} />
        <KpiCard title="Menus" value={overview.menus?.total || 0} subtitle={`${overview.menus?.active || 0} active`} />
        <KpiCard title="Views (30d)" value={overview.views?.last_30d || 0} />
        <KpiCard title="Chats (30d)" value={overview.chats?.last_30d || 0} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Registrations Over Time</CardTitle>
          <PeriodSelector value={period} onChange={setPeriod} />
        </CardHeader>
        <CardContent>
          {registrations?.data && registrations.data.length > 0 ? (
            <ChartContainer config={registrationConfig} className="h-[300px]">
              <AreaChart data={registrations.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="users" stackId="1" stroke="var(--color-users)" fill="var(--color-users)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="companies" stackId="1" stroke="var(--color-companies)" fill="var(--color-companies)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="restaurants" stackId="1" stroke="var(--color-restaurants)" fill="var(--color-restaurants)" fillOpacity={0.4} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No registration data for this period.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
