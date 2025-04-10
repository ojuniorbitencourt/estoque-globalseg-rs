import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  iconClassName?: string
}

export function StatCard({ title, value, description, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <Icon className={`h-5 w-5 ${iconClassName || "text-gray-400"}`} />
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}
