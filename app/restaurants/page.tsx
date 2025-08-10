import { serverApi } from '@/lib/server-api'
import { ToggleActiveButton } from '@/components/admin/toggle-active-button'

async function getRestaurants() {
  return serverApi('/admin/restaurants')
}

export default async function RestaurantsPage() {
  const data = await getRestaurants()
  const restaurants = data?.restaurants || []
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Restaurants</h2>
        <p className="text-sm text-muted-foreground">Browse and manage restaurants.</p>
      </div>
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Company</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.is_active ? 'active' : 'inactive'}</td>
                <td className="p-3">{r.company_id || '—'}</td>
                <td className="p-3">
                  <ToggleActiveButton resource="restaurants" id={r.id} isActive={r.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
