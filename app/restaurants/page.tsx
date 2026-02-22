import { Suspense } from 'react'
import { serverApi } from '@/lib/server-api'
import { PageHeader } from '@/components/admin/page-header'
import { RestaurantsTable } from './restaurants-table'

interface SearchParams {
  page?: string
  search?: string
  sort_by?: string
  sort_order?: string
  company_id?: string
}

async function getRestaurants(params: SearchParams) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.search) query.set('search', params.search)
  if (params.sort_by) query.set('sort_by', params.sort_by)
  if (params.sort_order) query.set('sort_order', params.sort_order)
  if (params.company_id) query.set('company_id', params.company_id)
  query.set('page_size', '25')
  return serverApi(`/admin/restaurants?${query.toString()}`)
}

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const params = (await searchParams) || {}
  const data = await getRestaurants(params)
  const restaurants = (data as any)?.restaurants || []
  const pagination = {
    page: (data as any)?.page || 1,
    totalPages: (data as any)?.total_pages || 1,
    total: (data as any)?.total || 0,
    pageSize: (data as any)?.page_size || 25,
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Restaurants" description="Browse and manage restaurants." />
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-md" />}>
        <RestaurantsTable
          restaurants={restaurants}
          pagination={pagination}
          sortBy={params.sort_by}
          sortOrder={params.sort_order}
        />
      </Suspense>
    </div>
  )
}
