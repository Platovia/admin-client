"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { PeriodSelector } from "./period-selector"

const chartConfig = {
  views: { label: "Views", color: "hsl(var(--chart-1))" },
  unique_viewers: { label: "Unique Visitors", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export function VisitorsTab() {
  const [data, setData] = useState<any>(null)
  const [period, setPeriod] = useState("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics/visitors?period=${period}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [period])

  if (loading) return <div className="flex justify-center py-12"><Spinner size={24} /></div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Menu Views Over Time</CardTitle>
          <PeriodSelector value={period} onChange={setPeriod} />
        </CardHeader>
        <CardContent>
          {data?.data && data.data.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="unique_viewers" stroke="var(--color-unique_viewers)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No visitor data for this period.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
