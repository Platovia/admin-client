import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'

async function getSubscription(id: string) {
  return serverApi(`/admin/subscriptions/${id}`)
}

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sub = (await getSubscription(id)) as any

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: "Subscriptions", href: "/subscriptions" },
        { label: sub.company_name || "Subscription" },
      ]} />

      <h2 className="text-xl font-semibold">Subscription</h2>

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Company" value={
              sub.company_name ? (
                <a href={`/companies/${sub.company_id}`} className="text-primary hover:underline">{sub.company_name}</a>
              ) : sub.company_id
            } />
            <DetailField label="Tier" value={
              <Badge variant={sub.tier === "paid" ? "info" : "secondary"}>{sub.tier}</Badge>
            } />
            <DetailField label="Status" value={
              <Badge variant={sub.status === "active" ? "success" : "warning"}>{sub.status}</Badge>
            } />
            <DetailField label="Provider" value={sub.provider} />
            <DetailField label="Period Start" value={formatDateTime(sub.current_period_start)} />
            <DetailField label="Period End" value={formatDateTime(sub.current_period_end)} />
            <DetailField label="Cancel at Period End" value={sub.cancel_at_period_end ? "Yes" : "No"} />
            <DetailField label="Created" value={formatDateTime(sub.created_at)} />
          </DetailGrid>
        </CardContent>
      </Card>
    </div>
  )
}
