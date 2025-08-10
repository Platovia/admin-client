import { serverApi } from '@/lib/server-api'
import { ToggleActiveButton } from '@/components/admin/toggle-active-button'

async function getUsers(search?: string) {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  return serverApi(`/admin/users${q}`)
}

async function getMe() {
  try {
    return await serverApi('/auth/me')
  } catch {
    return null
  }
}

export default async function UsersPage({ searchParams }: { searchParams?: { q?: string } }) {
  const [data, me] = await Promise.all([getUsers(searchParams?.q), getMe()])
  const users = data?.users || []
  const currentUserId = me?.id
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="text-sm text-muted-foreground">Manage application users and roles.</p>
      </div>
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">
                  {u.first_name} {u.last_name}
                  {currentUserId === u.id && (
                    <span
                      className="ml-2 align-middle text-[10px] px-1.5 py-0.5 rounded border border-muted-foreground/30 text-muted-foreground"
                    >
                      logged in user
                    </span>
                  )}
                </td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 capitalize">{u.is_active ? 'active' : 'disabled'}</td>
                <td className="p-3">
                  <ToggleActiveButton resource="users" id={u.id} isActive={u.is_active} currentUserId={currentUserId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
