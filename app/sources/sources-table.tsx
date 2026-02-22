"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Source {
  id: string
  restaurant_id: string
  source_category: string
  source_type: string
  label: string | null
  status: string
  is_active: boolean
  created_at: string
}

interface SourcesTableProps {
  sources: Source[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
}

const statusVariant = (status: string) => {
  switch (status) {
    case "completed": return "success"
    case "processing": return "info"
    case "failed": return "destructive"
    default: return "warning"
  }
}

export function SourcesTable({ sources, pagination, sortBy, sortOrder }: SourcesTableProps) {
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

  const columns: Column<Source>[] = [
    { key: "label", label: "Label", render: (row) => row.label || row.source_type },
    {
      key: "source_category",
      label: "Category",
      render: (row) => <Badge variant="outline">{row.source_category}</Badge>,
    },
    { key: "source_type", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={statusVariant(row.status) as any}>{row.status}</Badge>,
    },
    {
      key: "is_active",
      label: "Active",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "secondary"}>
          {row.is_active ? "Yes" : "No"}
        </Badge>
      ),
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
        data={sources}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/sources/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
