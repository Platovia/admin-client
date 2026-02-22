import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: number | string
  subtitle?: string
  trend?: number | null
  className?: string
}

export function KpiCard({ title, value, subtitle, trend, className }: KpiCardProps) {
  const trendIcon = trend && trend > 0
    ? <TrendingUp className="h-3.5 w-3.5 text-green-600" />
    : trend && trend < 0
      ? <TrendingDown className="h-3.5 w-3.5 text-red-600" />
      : null

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-2xl font-semibold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trendIcon}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
