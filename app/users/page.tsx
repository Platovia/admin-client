async function getUsers(search?: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await fetch(`${apiBase}/admin/users${q}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load users')
  return res.json()
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
