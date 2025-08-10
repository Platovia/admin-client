import { serverApi } from '@/lib/server-api'

async function getMenus() {
  return serverApi('/admin/menus')
}

export default async function MenusPage() {
  const data = await getMenus()
  const menus = data?.menus || []
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Menus</h2>
        <p className="text-sm text-muted-foreground">Moderate menus and items.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {menus.map((m: any) => (
          <div key={m.id} className="border rounded-lg p-4">
            <div className="font-medium">{m.name}</div>
            <div className="text-sm text-muted-foreground">Restaurant: {m.restaurant_id}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
