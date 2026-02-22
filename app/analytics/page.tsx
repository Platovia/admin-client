"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/admin/analytics/overview-tab"
import { VisitorsTab } from "@/components/admin/analytics/visitors-tab"
import { ChatTab } from "@/components/admin/analytics/chat-tab"
import { TopPerformersTab } from "@/components/admin/analytics/top-performers-tab"

export default function AnalyticsPage() {
  const [tab, setTab] = useState("overview")

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Platform-wide metrics and insights." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="visitors">
          <VisitorsTab />
        </TabsContent>
        <TabsContent value="chat">
          <ChatTab />
        </TabsContent>
        <TabsContent value="top-performers">
          <TopPerformersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
