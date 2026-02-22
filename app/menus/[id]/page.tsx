import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RelatedTable } from '@/components/admin/related-table'
import { formatDateTime } from '@/lib/utils'
import { MenuDetailClient } from './menu-detail-client'

async function getMenu(id: string) {
  return serverApi(`/admin/menus/${id}`)
}

export default async function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const menu = (await getMenu(id)) as any

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Menus", href: "/menus" }, { label: menu.name }]} />

      <MenuDetailClient menu={menu} />

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Name" value={menu.name} />
            <DetailField label="Restaurant" value={
              menu.restaurant_name ? (
                <a href={`/restaurants/${menu.restaurant_id}`} className="text-primary hover:underline">
                  {menu.restaurant_name}
                </a>
              ) : "—"
            } />
            <DetailField label="Status" value={
              <Badge variant={menu.is_active ? "success" : "destructive"}>
                {menu.is_active ? "Active" : "Inactive"}
              </Badge>
            } />
            <DetailField label="Layout" value={
              menu.layout_status ? (
                <Badge variant={menu.layout_status === "published" ? "success" : "secondary"}>
                  {menu.layout_status}
                </Badge>
              ) : "—"
            } />
            <DetailField label="Total Views" value={menu.view_count?.toLocaleString()} />
            <DetailField label="Items" value={menu.items?.length} />
            <DetailField label="Needs Embedding Refresh" value={menu.needs_embedding_refresh ? "Yes" : "No"} />
            <DetailField label="Created" value={formatDateTime(menu.created_at)} />
            <DetailField label="Updated" value={formatDateTime(menu.updated_at)} />
          </DetailGrid>
        </CardContent>
      </Card>

      <RelatedTable
        title="Menu Items"
        columns={[
          { key: "name", label: "Name" },
          { key: "category", label: "Category" },
          { key: "price", label: "Price", render: (r: any) => r.price != null ? `$${r.price.toFixed(2)}` : "—" },
          {
            key: "is_available", label: "Available",
            render: (r: any) => <Badge variant={r.is_available ? "success" : "secondary"}>{r.is_available ? "Yes" : "No"}</Badge>,
          },
        ]}
        data={menu.items || []}
      />

      {menu.images && menu.images.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Images ({menu.images.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {menu.images.map((img: any) => (
                <div key={img.id} className="border rounded-md overflow-hidden">
                  <img src={img.image_url} alt={img.image_filename || "Menu image"} className="w-full h-32 object-cover" />
                  <p className="p-1 text-xs text-muted-foreground truncate">{img.image_filename}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <RelatedTable
        title="Versions"
        columns={[
          { key: "version_number", label: "#" },
          { key: "name", label: "Name" },
          {
            key: "status", label: "Status",
            render: (r: any) => <Badge variant={r.status === "active" ? "success" : "secondary"}>{r.status}</Badge>,
          },
          { key: "item_count", label: "Items" },
        ]}
        data={menu.versions || []}
      />

      <RelatedTable
        title="QR Tokens"
        columns={[
          { key: "token", label: "Token", render: (r: any) => <code className="text-xs">{r.token?.slice(0, 12)}...</code> },
          {
            key: "is_active", label: "Active",
            render: (r: any) => <Badge variant={r.is_active ? "success" : "secondary"}>{r.is_active ? "Yes" : "No"}</Badge>,
          },
          { key: "access_count", label: "Scans" },
          { key: "expires_at", label: "Expires", render: (r: any) => formatDateTime(r.expires_at) },
        ]}
        data={menu.qr_tokens || []}
        rowHref={(r: any) => `/qr-tokens/${r.id}`}
      />
    </div>
  )
}
