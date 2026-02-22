import { Suspense } from 'react'
import { serverApi } from '@/lib/server-api'
import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { UsersTable } from './users-table'

interface SearchParams {
  page?: string
  search?: string
  sort_by?: string
  sort_order?: string
  status?: string
}

async function getUsers(params: SearchParams) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.search) query.set('search', params.search)
  if (params.sort_by) query.set('sort_by', params.sort_by)
  if (params.sort_order) query.set('sort_order', params.sort_order)
  if (params.status) query.set('status', params.status)
  query.set('page_size', '25')
  return serverApi(`/admin/users?${query.toString()}`)
}

async function getMe() {
  try {
    return await serverApi('/auth/me')
  } catch {
    return null
  }
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const params = (await searchParams) || {}
  const [data, me] = await Promise.all([getUsers(params), getMe()])
  const users = (data as any)?.users || []
  const pagination = {
    page: (data as any)?.page || 1,
    totalPages: (data as any)?.total_pages || 1,
    total: (data as any)?.total || 0,
    pageSize: (data as any)?.page_size || 25,
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users"
        description="Manage application users and roles."
      />
      <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-md" />}>
        <UsersTable
          users={users}
          currentUserId={(me as any)?.id}
          pagination={pagination}
          sortBy={params.sort_by}
          sortOrder={params.sort_order}
        />
      </Suspense>
    </div>
  )
}
