import { serverApi } from '@/lib/server-api'

async function getUsers(search?: string) {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  return serverApi(`/admin/users${q}`)
}

export default async function UsersPage({ searchParams }: { searchParams?: { q?: string } }) {
  const data = await getUsers(searchParams?.q)
  const users = data?.users || []
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
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.first_name} {u.last_name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 capitalize">{u.is_active ? 'active' : 'disabled'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
