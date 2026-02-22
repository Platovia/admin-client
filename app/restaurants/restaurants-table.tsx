"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Restaurant {
  id: string
  name: string
  company_id: string | null
  company_name: string
  is_active: boolean
  currency_code: string | null
  menu_count: number
  created_at: string
}

interface RestaurantsTableProps {
  restaurants: Restaurant[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
}

export function RestaurantsTable({ restaurants, pagination, sortBy, sortOrder }: RestaurantsTableProps) {
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

  const columns: Column<Restaurant>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "company_name", label: "Company" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "destructive"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { key: "menu_count", label: "Menus" },
    { key: "currency_code", label: "Currency" },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row) => <span className="text-muted-foreground">{formatDate(row.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <SearchInput placeholder="Search restaurants..." />
      <DataTable
        columns={columns}
        data={restaurants}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/restaurants/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
