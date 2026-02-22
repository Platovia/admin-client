"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { KpiCard } from "./kpi-card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { PeriodSelector } from "./period-selector"

const lineConfig = {
  sessions: { label: "Sessions", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const barConfig = {
  sessions: { label: "Sessions", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export function ChatTab() {
  const [data, setData] = useState<any>(null)
  const [period, setPeriod] = useState("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics/chat?period=${period}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [period])

  if (loading) return <div className="flex justify-center py-12"><Spinner size={24} /></div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
          <KpiCard title="Total Sessions" value={data.total_sessions || 0} />
          <KpiCard title="Total Messages" value={data.total_messages || 0} />
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {data.sessions_over_time?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Sessions Over Time</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={lineConfig} className="h-[250px]">
              <LineChart data={data.sessions_over_time}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="sessions" stroke="var(--color-sessions)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {data.peak_hours?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Peak Hours</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="h-[200px]">
              <BarChart data={data.peak_hours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {data.popular_questions?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Popular Questions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.popular_questions.slice(0, 15).map((q: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <span className="truncate mr-4 flex-1">{q.question}</span>
                  <span className="text-muted-foreground font-mono text-xs">{q.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
