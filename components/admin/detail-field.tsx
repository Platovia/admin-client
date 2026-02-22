import { cn } from "@/lib/utils"

interface DetailFieldProps {
  label: string
  value: React.ReactNode
  className?: string
}

export function DetailField({ label, value, className }: DetailFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value ?? "—"}</dd>
    </div>
  )
}

interface DetailGridProps {
  children: React.ReactNode
  className?: string
}

export function DetailGrid({ children, className }: DetailGridProps) {
  return (
    <dl className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {children}
    </dl>
  )
}
