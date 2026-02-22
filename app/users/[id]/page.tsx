import { notFound } from 'next/navigation'
import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RelatedTable } from '@/components/admin/related-table'
import { formatDateTime } from '@/lib/utils'
import { UserActions } from './user-actions'

async function getUser(id: string) {
  try {
    return await serverApi(`/admin/users/${id}`)
  } catch {
    return null
  }
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = (await getUser(id)) as any
  if (!user) notFound()

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Users", href: "/users" }, { label: `${user.first_name} ${user.last_name}` }]} />

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <UserActions user={user} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Email" value={user.email} />
            <DetailField label="Status" value={
              <Badge variant={user.is_active ? "success" : "destructive"}>
                {user.is_active ? "Active" : "Inactive"}
              </Badge>
            } />
            <DetailField label="Verified" value={
              <Badge variant={user.is_verified ? "success" : "warning"}>
                {user.is_verified ? "Verified" : "Unverified"}
              </Badge>
            } />
            <DetailField label="Last Login" value={formatDateTime(user.last_login)} />
            <DetailField label="Created" value={formatDateTime(user.created_at)} />
            <DetailField label="Updated" value={formatDateTime(user.updated_at)} />
          </DetailGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Roles</CardTitle></CardHeader>
        <CardContent>
          {user.roles?.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {user.roles.map((r: any) => (
                <Badge key={r.id} variant="outline">{r.name}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No roles assigned.</p>
          )}
        </CardContent>
      </Card>

      <RelatedTable
        title="Company Memberships"
        columns={[
          { key: "company_name", label: "Company" },
          { key: "role", label: "Role" },
          {
            key: "is_active",
            label: "Status",
            render: (row: any) => (
              <Badge variant={row.is_active ? "success" : "secondary"}>
                {row.is_active ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          { key: "joined_at", label: "Joined", render: (row: any) => formatDateTime(row.joined_at) },
        ]}
        data={user.company_memberships || []}
        rowHref={(row: any) => `/companies/${row.company_id}`}
      />
    </div>
  )
}
