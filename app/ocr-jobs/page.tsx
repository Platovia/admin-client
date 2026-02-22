import { Suspense } from 'react'
import { serverApi } from '@/lib/server-api'
import { PageHeader } from '@/components/admin/page-header'
import { OcrJobsTable } from './ocr-jobs-table'

interface SearchParams {
  page?: string
  sort_by?: string
  sort_order?: string
  status?: string
}

async function getJobs(params: SearchParams) {
  try {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page)
    if (params.sort_by) query.set('sort_by', params.sort_by)
    if (params.sort_order) query.set('sort_order', params.sort_order)
    if (params.status) query.set('status', params.status)
    query.set('page_size', '25')
    return await serverApi(`/admin/ocr/jobs?${query.toString()}`)
  } catch {
    return null
  }
}

export default async function OcrJobsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const params = (await searchParams) || {}
  const data = await getJobs(params)
  const jobs = (data as any)?.jobs || []
  const pagination = {
    page: (data as any)?.page || 1,
    totalPages: (data as any)?.total_pages || 1,
    total: (data as any)?.total || 0,
    pageSize: (data as any)?.page_size || 25,
  }

  return (
    <div className="space-y-4">
      <PageHeader title="OCR Jobs" description="Monitor and manage OCR processing jobs." />
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-md" />}>
        <OcrJobsTable
          jobs={jobs}
          pagination={pagination}
          sortBy={params.sort_by}
          sortOrder={params.sort_order}
        />
      </Suspense>
    </div>
  )
}
