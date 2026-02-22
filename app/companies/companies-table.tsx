"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Company {
  id: string
  name: string
  subscription_tier: string
  is_active: boolean
  restaurant_count: number
  user_count: number
  created_at: string
}

interface CompaniesTableProps {
  companies: Company[]
  pagination: { page: number; totalPages: number; total: number; pageSize: number }
  sortBy?: string
  sortOrder?: string
}

export function CompaniesTable({ companies, pagination, sortBy, sortOrder }: CompaniesTableProps) {
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

  const columns: Column<Company>[] = [
    { key: "name", label: "Name", sortable: true },
    {
      key: "subscription_tier",
      label: "Tier",
      render: (row) => (
        <Badge variant={row.subscription_tier === "paid" ? "info" : "secondary"}>
          {row.subscription_tier}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "destructive"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { key: "restaurant_count", label: "Restaurants", sortable: false },
    { key: "user_count", label: "Users", sortable: false },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row) => <span className="text-muted-foreground">{formatDate(row.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <SearchInput placeholder="Search companies..." />
      <DataTable
        columns={columns}
        data={companies}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/companies/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
