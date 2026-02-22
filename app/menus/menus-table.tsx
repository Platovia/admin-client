"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Menu {
  id: string
  name: string
  restaurant_id: string
  restaurant_name: string
  is_active: boolean
  layout_status: string | null
  item_count: number
  created_at: string
}

interface MenusTableProps {
  menus: Menu[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
}

export function MenusTable({ menus, pagination, sortBy, sortOrder }: MenusTableProps) {
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

  const columns: Column<Menu>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "restaurant_name", label: "Restaurant" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "destructive"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { key: "item_count", label: "Items" },
    {
      key: "layout_status",
      label: "Layout",
      render: (row) =>
        row.layout_status ? (
          <Badge variant={row.layout_status === "published" ? "success" : "secondary"}>
            {row.layout_status}
          </Badge>
        ) : (
          "—"
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
      <SearchInput placeholder="Search menus..." />
      <DataTable
        columns={columns}
        data={menus}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/menus/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
