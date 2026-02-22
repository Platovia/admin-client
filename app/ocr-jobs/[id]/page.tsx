import { notFound } from 'next/navigation'
import { serverApi } from '@/lib/server-api'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { DetailField, DetailGrid } from '@/components/admin/detail-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RelatedTable } from '@/components/admin/related-table'
import { formatDateTime, truncateId } from '@/lib/utils'

async function getJob(id: string) {
  try {
    return await serverApi(`/admin/ocr/jobs/${id}`)
  } catch {
    return null
  }
}

const statusVariant = (status: string) => {
  switch (status) {
    case "completed": return "success"
    case "processing": return "info"
    case "failed": return "destructive"
    case "cancelled": return "secondary"
    default: return "warning"
  }
}

export default async function OcrJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = (await getJob(id)) as any
  if (!job) notFound()

  const progress = job.total_images > 0
    ? Math.round(((job.processed_images || 0) / job.total_images) * 100)
    : 0

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "OCR Jobs", href: "/ocr-jobs" }, { label: truncateId(job.id) }]} />

      <h2 className="text-xl font-semibold">OCR Job</h2>

      <Card>
        <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailField label="Job ID" value={<code className="text-xs">{job.id}</code>} />
            <DetailField label="Menu" value={
              job.menu_name ? (
                <a href={`/menus/${job.menu_id}`} className="text-primary hover:underline">{job.menu_name}</a>
              ) : job.menu_id
            } />
            <DetailField label="Status" value={
              <Badge variant={statusVariant(job.status) as any}>{job.status}</Badge>
            } />
            <DetailField label="Progress" value={
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs">{progress}% ({job.processed_images || 0}/{job.total_images || 0})</span>
              </div>
            } />
            <DetailField label="Model" value={job.model_used} />
            <DetailField label="Started" value={formatDateTime(job.processing_started_at)} />
            <DetailField label="Completed" value={formatDateTime(job.processing_completed_at)} />
            <DetailField label="Created" value={formatDateTime(job.created_at)} />
          </DetailGrid>
          {job.error_message && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {job.error_message}
            </div>
          )}
        </CardContent>
      </Card>

      <RelatedTable
        title="Results"
        columns={[
          { key: "image_url", label: "Image", render: (r: any) => (
            <a href={r.image_url} target="_blank" className="text-primary hover:underline text-xs truncate max-w-[200px] block">
              {r.image_url?.split('/').pop()}
            </a>
          )},
          { key: "confidence_score", label: "Confidence", render: (r: any) => r.confidence_score != null ? `${(r.confidence_score * 100).toFixed(1)}%` : "—" },
          { key: "extraction_method", label: "Method" },
        ]}
        data={job.results || []}
      />
    </div>
  )
}
