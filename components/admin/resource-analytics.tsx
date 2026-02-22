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
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar, CartesianGrid } from "recharts"

interface ResourceAnalyticsProps {
  resourceType: string
  resourceId: string
}

const chartConfig = {
  views: { label: "Views", color: "hsl(var(--chart-1))" },
  chats: { label: "Chats", color: "hsl(var(--chart-2))" },
  scans: { label: "QR Scans", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function ResourceAnalytics({ resourceType, resourceId }: ResourceAnalyticsProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/admin/${resourceType}/${resourceId}/analytics`)
        if (res.ok) {
          setData(await res.json())
        }
      } catch {
        // Analytics may not be available for all resources
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [resourceType, resourceId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size={24} />
      </div>
    )
  }

  if (!data) return null

  const kpis = [
    { label: "Total Views", value: data.total_views ?? 0 },
    { label: "Unique Visitors", value: data.unique_viewers ?? 0 },
    { label: "QR Scans", value: data.total_qr_scans ?? 0 },
    { label: "Chat Sessions", value: data.chat_analytics?.total_sessions ?? data.chat_detail?.total_conversations ?? 0 },
  ]

  const weeklyStats = data.weekly_stats || data.chat_detail?.conversations_over_time || []
  const peakHours = data.chat_detail?.peak_chat_hours || []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-semibold">{kpi.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {weeklyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <AreaChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tickFormatter={(v) => typeof v === "string" ? v.slice(5) : v} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="views" stackId="1" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="chats" stackId="2" stroke="var(--color-chats)" fill="var(--color-chats)" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {peakHours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="conversations" fill="var(--color-chats)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {data.popular_questions && data.popular_questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Popular Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.popular_questions.slice(0, 10).map((q: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="truncate mr-4">{q.question}</span>
                  <span className="text-muted-foreground whitespace-nowrap">{q.count}x</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
