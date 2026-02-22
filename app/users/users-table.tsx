"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_verified: boolean
  roles: string[]
  last_login: string | null
  created_at: string
}

interface UsersTableProps {
  users: User[]
  currentUserId?: string
  pagination: {
    page: number
    totalPages: number
    total: number
    pageSize: number
  }
  sortBy?: string
  sortOrder?: string
}

export function UsersTable({ users, currentUserId, pagination, sortBy, sortOrder }: UsersTableProps) {
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

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <span>
          {row.first_name} {row.last_name}
          {currentUserId === row.id && (
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded border border-muted-foreground/30 text-muted-foreground">
              you
            </span>
          )}
        </span>
      ),
    },
    { key: "email", label: "Email", sortable: true },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "destructive"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "roles",
      label: "Roles",
      render: (row) =>
        row.roles.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {row.roles.map((r) => (
              <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "last_login",
      label: "Last Login",
      sortable: true,
      render: (row) => <span className="text-muted-foreground">{formatDate(row.last_login)}</span>,
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
      <SearchInput placeholder="Search by name or email..." />
      <DataTable
        columns={columns}
        data={users}
        sortBy={sortBy || "created_at"}
        sortOrder={sortOrder || "desc"}
        onSort={onSort}
        rowHref={(row) => `/users/${row.id}`}
      />
      <Pagination {...pagination} />
    </div>
  )
}
