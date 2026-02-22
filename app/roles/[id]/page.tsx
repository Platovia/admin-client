import { notFound } from 'next/navigation'
import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RelatedTable } from '@/components/admin/related-table'
import { formatDateTime } from '@/lib/utils'
import { RoleActions } from './role-actions'

async function getRole(id: string) {
  try {
    return await serverApi(`/admin/roles/${id}`)
  } catch {
    return null
  }
}

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const role = (await getRole(id)) as any
  if (!role) notFound()

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Roles", href: "/roles" }, { label: role.name }]} />

      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold">{role.name}</h2>
        <RoleActions role={role} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Name" value={role.name} />
            <DetailField label="Description" value={role.description} />
            <DetailField label="Created" value={formatDateTime(role.created_at)} />
          </DetailGrid>
        </CardContent>
      </Card>

      <RelatedTable
        title="Users with this role"
        columns={[
          { key: "email", label: "Email" },
          { key: "first_name", label: "Name", render: (r: any) => `${r.first_name || ""} ${r.last_name || ""}`.trim() },
        ]}
        data={role.users || []}
        rowHref={(r: any) => `/users/${r.id}`}
      />
    </div>
  )
}
