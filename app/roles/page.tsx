import { serverApi } from '@/lib/server-api'
import { PageHeader } from '@/components/admin/page-header'
import { RolesTable } from './roles-table'

async function getRoles() {
  try {
    return await serverApi('/admin/roles')
  } catch {
    return null
  }
}

export default async function RolesPage() {
  const data = await getRoles()
  const roles = (data as any)?.roles || []

  return (
    <div className="space-y-4">
      <PageHeader title="Roles" description="Manage global system roles." />
      <RolesTable roles={roles} />
    </div>
  )
}
