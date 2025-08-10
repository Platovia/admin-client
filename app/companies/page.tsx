import { serverApi } from '@/lib/server-api'

async function getCompanies() {
  return serverApi('/admin/companies')
}

export default async function CompaniesPage() {
  const data = await getCompanies()
  const companies = data?.companies || []
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Companies</h2>
        <p className="text-sm text-muted-foreground">Manage companies and memberships.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {companies.map((c: any) => (
          <div key={c.id} className="border rounded-lg p-4">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-muted-foreground">{c.subscription_tier}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
