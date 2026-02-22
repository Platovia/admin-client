"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Subscription {
  id: string
  company_id: string
  company_name: string
  tier: string
  status: string
  current_period_end: string | null
  created_at: string | null
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
}

export function SubscriptionsTable({ subscriptions, pagination, sortBy, sortOrder }: SubscriptionsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onSort = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentSortBy = params.get("sort_by")
    const currentOrder = params.get("sort_order") || "desc"
    if (currentSortBy === key) {
      params.set("sort_order", currentOrder === "asc" ? "desc" : "asc")
    } else {
      params.set("sort_by", key)
      params.set("sort_order", "desc")
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const columns: Column<Subscription>[] = [
    { key: "company_name", label: "Company" },
    {
      key: "tier",
      label: "Tier",
      render: (row) => <Badge variant={row.tier === "paid" ? "info" : "secondary"}>{row.tier}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "warning"}>{row.status}</Badge>
      ),
    },
    {
      key: "current_period_end",
      label: "Period Ends",
      render: (row) => <span className="text-muted-foreground">{formatDate(row.current_period_end)}</span>,
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row) => <span className="text-muted-foreground">{formatDate(row.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={subscriptions}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/subscriptions/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
