"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { formatDateTime } from "@/lib/utils"

interface ChatSession {
  id: string
  menu_id: string
  menu_name: string
  message_count: number
  last_activity: string | null
  created_at: string
}

interface ChatSessionsTableProps {
  sessions: ChatSession[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
}

export function ChatSessionsTable({ sessions, pagination, sortBy, sortOrder }: ChatSessionsTableProps) {
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

  const columns: Column<ChatSession>[] = [
    { key: "menu_name", label: "Menu" },
    { key: "message_count", label: "Messages" },
    {
      key: "last_activity",
      label: "Last Activity",
      sortable: true,
      render: (row) => <span className="text-muted-foreground">{formatDateTime(row.last_activity)}</span>,
    },
    {
      key: "created_at",
      label: "Started",
      sortable: true,
      render: (row) => <span className="text-muted-foreground">{formatDateTime(row.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={sessions}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/chat-sessions/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
