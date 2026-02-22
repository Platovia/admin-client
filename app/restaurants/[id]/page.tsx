import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RelatedTable } from '@/components/admin/related-table'
import { formatDateTime } from '@/lib/utils'
import { RestaurantDetailClient } from './restaurant-detail-client'

async function getRestaurant(id: string) {
  return serverApi(`/admin/restaurants/${id}`)
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const restaurant = (await getRestaurant(id)) as any

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: "Restaurants", href: "/restaurants" },
        { label: restaurant.name },
      ]} />

      <RestaurantDetailClient restaurant={restaurant} />

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Name" value={restaurant.name} />
            <DetailField label="Company" value={
              restaurant.company_name ? (
                <a href={`/companies/${restaurant.company_id}`} className="text-primary hover:underline">
                  {restaurant.company_name}
                </a>
              ) : "—"
            } />
            <DetailField label="Status" value={
              <Badge variant={restaurant.is_active ? "success" : "destructive"}>
                {restaurant.is_active ? "Active" : "Inactive"}
              </Badge>
            } />
            <DetailField label="Currency" value={restaurant.currency_code} />
            <DetailField label="Locale" value={restaurant.locale} />
            <DetailField label="Created" value={formatDateTime(restaurant.created_at)} />
            <DetailField label="Updated" value={formatDateTime(restaurant.updated_at)} />
          </DetailGrid>
        </CardContent>
      </Card>

      {restaurant.description && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Description</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{restaurant.description}</p></CardContent>
        </Card>
      )}

      <RelatedTable
        title="Menus"
        columns={[
          { key: "name", label: "Name" },
          {
            key: "is_active", label: "Status",
            render: (r: any) => <Badge variant={r.is_active ? "success" : "secondary"}>{r.is_active ? "Active" : "Inactive"}</Badge>,
          },
          { key: "layout_status", label: "Layout" },
          { key: "created_at", label: "Created", render: (r: any) => formatDateTime(r.created_at) },
        ]}
        data={restaurant.menus || []}
        rowHref={(r: any) => `/menus/${r.id}`}
      />

      <RelatedTable
        title="Sources"
        columns={[
          { key: "label", label: "Label", render: (r: any) => r.label || r.source_type },
          { key: "source_category", label: "Category" },
          { key: "status", label: "Status" },
          {
            key: "is_active", label: "Active",
            render: (r: any) => <Badge variant={r.is_active ? "success" : "secondary"}>{r.is_active ? "Yes" : "No"}</Badge>,
          },
        ]}
        data={restaurant.sources || []}
        rowHref={(r: any) => `/sources/${r.id}`}
      />
    </div>
  )
}
