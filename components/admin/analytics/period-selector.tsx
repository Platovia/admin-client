"use client"

import { cn } from "@/lib/utils"

interface PeriodSelectorProps {
  value: string
  onChange: (value: string) => void
}

const periods = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "12M", value: "12m" },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all",
            value === p.value
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
