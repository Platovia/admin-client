import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RelatedTable } from '@/components/admin/related-table'
import { formatDateTime } from '@/lib/utils'
import { CompanyDetailClient } from './company-detail-client'

async function getCompany(id: string) {
  return serverApi(`/admin/companies/${id}`)
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = (await getCompany(id)) as any

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Companies", href: "/companies" }, { label: company.name }]} />

      <CompanyDetailClient company={company} />

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Name" value={company.name} />
            <DetailField label="Description" value={company.description} />
            <DetailField label="Tier" value={
              <Badge variant={company.subscription_tier === "paid" ? "info" : "secondary"}>
                {company.subscription_tier}
              </Badge>
            } />
            <DetailField label="Status" value={
              <Badge variant={company.is_active ? "success" : "destructive"}>
                {company.is_active ? "Active" : "Inactive"}
              </Badge>
            } />
            <DetailField label="Created" value={formatDateTime(company.created_at)} />
            <DetailField label="Updated" value={formatDateTime(company.updated_at)} />
          </DetailGrid>
        </CardContent>
      </Card>

      {company.subscription && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Subscription</CardTitle></CardHeader>
          <CardContent>
            <DetailGrid>
              <DetailField label="Tier" value={company.subscription.tier} />
              <DetailField label="Status" value={company.subscription.status} />
              <DetailField label="Period End" value={formatDateTime(company.subscription.current_period_end)} />
            </DetailGrid>
          </CardContent>
        </Card>
      )}

      <RelatedTable
        title="Members"
        columns={[
          { key: "email", label: "Email" },
          { key: "first_name", label: "Name", render: (r: any) => `${r.first_name || ""} ${r.last_name || ""}`.trim() },
          { key: "role", label: "Role" },
          {
            key: "is_active", label: "Status",
            render: (r: any) => <Badge variant={r.is_active ? "success" : "secondary"}>{r.is_active ? "Active" : "Inactive"}</Badge>,
          },
        ]}
        data={company.members || []}
        rowHref={(r: any) => `/users/${r.user_id}`}
      />

      <RelatedTable
        title="Restaurants"
        columns={[
          { key: "name", label: "Name" },
          {
            key: "is_active", label: "Status",
            render: (r: any) => <Badge variant={r.is_active ? "success" : "secondary"}>{r.is_active ? "Active" : "Inactive"}</Badge>,
          },
          { key: "created_at", label: "Created", render: (r: any) => formatDateTime(r.created_at) },
        ]}
        data={company.restaurants || []}
        rowHref={(r: any) => `/restaurants/${r.id}`}
      />
    </div>
  )
}
