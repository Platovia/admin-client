import Link from "next/link"
import { cn } from "@/lib/utils"

interface RelatedTableColumn {
  key: string
  label: string
  render?: (row: any) => React.ReactNode
}

interface RelatedTableProps {
  title: string
  columns: RelatedTableColumn[]
  data: any[]
  rowHref?: (row: any) => string
  emptyMessage?: string
  className?: string
}

export function RelatedTable({
  title,
  columns,
  data,
  rowHref,
  emptyMessage = "None found.",
  className,
}: RelatedTableProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-medium">{title} ({data.length})</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="text-left p-2 font-medium text-muted-foreground text-xs">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const href = rowHref?.(row)
                return (
                  <tr key={row.id || i} className="border-t">
                    {columns.map((col, ci) => {
                      const cellContent = col.render ? col.render(row) : row[col.key] ?? "—"
                      return (
                        <td key={col.key} className="p-2 text-xs">
                          {ci === 0 && href ? (
                            <Link href={href} className="hover:underline text-primary">
                              {cellContent}
                            </Link>
                          ) : (
                            cellContent
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
