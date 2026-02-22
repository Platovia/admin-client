"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { Badge } from "@/components/ui/badge"
import { formatDate, truncateId } from "@/lib/utils"

interface QrToken {
  id: string
  menu_id: string
  menu_name: string
  token: string
  is_active: boolean
  access_count: number
  expires_at: string | null
  created_at: string
}

interface QrTokensTableProps {
  tokens: QrToken[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
}

export function QrTokensTable({ tokens, pagination, sortBy, sortOrder }: QrTokensTableProps) {
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

  const columns: Column<QrToken>[] = [
    {
      key: "token",
      label: "Token",
      render: (row) => <code className="text-xs">{truncateId(row.token, 12)}</code>,
    },
    { key: "menu_name", label: "Menu" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "destructive"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { key: "access_count", label: "Scans" },
    {
      key: "expires_at",
      label: "Expires",
      render: (row) => <span className="text-muted-foreground">{formatDate(row.expires_at)}</span>,
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
        data={tokens}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/qr-tokens/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
