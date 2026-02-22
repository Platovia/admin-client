"use client"

import { useRouter } from "next/navigation"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  sortBy?: string
  sortOrder?: string
  onSort?: (key: string) => void
  onRowClick?: (row: T) => void
  rowHref?: (row: T) => string
  emptyMessage?: string
  getRowId?: (row: T) => string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  rowHref,
  emptyMessage = "No records found.",
  getRowId,
}: DataTableProps<T>) {
  const router = useRouter()

  const handleRowClick = (row: T) => {
    if (rowHref) {
      router.push(rowHref(row))
    } else if (onRowClick) {
      onRowClick(row)
    }
  }

  const isClickable = !!rowHref || !!onRowClick

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left p-3 font-medium text-muted-foreground whitespace-nowrap",
                    col.sortable && onSort && "cursor-pointer select-none hover:text-foreground",
                    col.className
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && onSort && (
                      sortBy === col.key ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={getRowId ? getRowId(row) : row.id || i}
                  onClick={() => handleRowClick(row)}
                  className={cn(
                    "border-t transition-colors",
                    isClickable && "cursor-pointer hover:bg-muted/50"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("p-3", col.className)}>
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
