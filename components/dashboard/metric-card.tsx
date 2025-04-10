import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | ReactNode
  icon?: ReactNode
  change?: {
    value: string
    positive?: boolean
  }
  className?: string
}

export function MetricCard({ title, value, icon, change, className }: MetricCardProps) {
  return (
    <div className={cn("content-card", className)}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={cn("text-xs mt-1", change.positive ? "text-green-600" : "text-red-600")}>{change.value}</div>
        )}
      </div>
    </div>
  )
}
