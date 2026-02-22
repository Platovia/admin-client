"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { Badge } from "@/components/ui/badge"
import { formatDate, truncateId } from "@/lib/utils"

interface OcrJob {
  id: string
  menu_id: string
  menu_name: string
  status: string
  progress: number
  total_images: number
  processed_images: number
  created_at: string
}

interface OcrJobsTableProps {
  jobs: OcrJob[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
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

export function OcrJobsTable({ jobs, pagination, sortBy, sortOrder }: OcrJobsTableProps) {
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

  const columns: Column<OcrJob>[] = [
    {
      key: "id",
      label: "Job ID",
      render: (row) => <code className="text-xs">{truncateId(row.id)}</code>,
    },
    { key: "menu_name", label: "Menu" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={statusVariant(row.status) as any}>{row.status}</Badge>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{row.progress}%</span>
        </div>
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
        data={jobs}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/ocr-jobs/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
