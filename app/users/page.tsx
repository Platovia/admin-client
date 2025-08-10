export default function UsersPage() {
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
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: 'Alice Johnson', e: 'alice@example.com', r: 'admin', s: 'active' },
              { n: 'Bob Smith', e: 'bob@example.com', r: 'editor', s: 'active' },
              { n: 'Eve Adams', e: 'eve@example.com', r: 'viewer', s: 'disabled' },
            ].map((u, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{u.n}</td>
                <td className="p-3 text-muted-foreground">{u.e}</td>
                <td className="p-3">{u.r}</td>
                <td className="p-3 capitalize">{u.s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
