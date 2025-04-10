import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  className?: string
}

export function MetricCard({ title, value, description, icon, className }: MetricCardProps) {
  return (
    <div
      className={cn("bg-white border rounded-lg overflow-hidden p-4 dark:bg-gray-950 dark:border-gray-800", className)}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h2>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  )
}
