import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime, truncateId } from '@/lib/utils'
import { QrTokenActions } from './qr-token-actions'

async function getToken(id: string) {
  return serverApi(`/admin/qr-tokens/${id}`)
}

export default async function QrTokenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = (await getToken(id)) as any

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "QR Tokens", href: "/qr-tokens" }, { label: truncateId(token.token || token.id, 12) }]} />

      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold">QR Token</h2>
        <QrTokenActions token={token} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Token" value={<code className="text-xs break-all">{token.token}</code>} />
            <DetailField label="Menu" value={
              token.menu_name ? (
                <a href={`/menus/${token.menu_id}`} className="text-primary hover:underline">{token.menu_name}</a>
              ) : token.menu_id
            } />
            <DetailField label="Status" value={
              <Badge variant={token.is_active ? "success" : "destructive"}>
                {token.is_active ? "Active" : "Inactive"}
              </Badge>
            } />
            <DetailField label="Access Count" value={token.access_count} />
            <DetailField label="Expires" value={formatDateTime(token.expires_at)} />
            <DetailField label="Created" value={formatDateTime(token.created_at)} />
          </DetailGrid>
        </CardContent>
      </Card>
    </div>
  )
}
