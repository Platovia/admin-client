import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'
import { SourceActions } from './source-actions'

async function getSource(id: string) {
  return serverApi(`/admin/sources/${id}`)
}

export default async function SourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const source = (await getSource(id)) as any

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Sources", href: "/sources" }, { label: source.label || source.source_type }]} />

      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold">{source.label || source.source_type}</h2>
        <SourceActions source={source} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Label" value={source.label} />
            <DetailField label="Category" value={<Badge variant="outline">{source.source_category}</Badge>} />
            <DetailField label="Type" value={source.source_type} />
            <DetailField label="Status" value={
              <Badge variant={source.status === "completed" ? "success" : source.status === "failed" ? "destructive" : "warning"}>
                {source.status}
              </Badge>
            } />
            <DetailField label="Active" value={
              <Badge variant={source.is_active ? "success" : "secondary"}>{source.is_active ? "Yes" : "No"}</Badge>
            } />
            <DetailField label="URL" value={source.url ? (
              <a href={source.url} target="_blank" className="text-primary hover:underline text-xs break-all">{source.url}</a>
            ) : "—"} />
            <DetailField label="File" value={source.file_name} />
            <DetailField label="Items Extracted" value={source.items_extracted} />
            <DetailField label="Last Processed" value={formatDateTime(source.last_processed_at)} />
            <DetailField label="Created" value={formatDateTime(source.created_at)} />
          </DetailGrid>
          {source.error_message && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {source.error_message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
