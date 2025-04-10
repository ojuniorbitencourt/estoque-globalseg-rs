import { type LucideIcon, AlertCircle, CheckCircle } from "lucide-react"
import type { ReactNode } from "react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  iconClassName?: string
  action?: ReactNode
  type?: "info" | "success" | "warning" | "error"
}

export function EmptyState({ icon: Icon, title, description, iconClassName, action, type = "info" }: EmptyStateProps) {
  const getIcon = () => {
    if (Icon) return Icon
    if (type === "success") return CheckCircle
    return AlertCircle
  }

  const getIconClass = () => {
    if (iconClassName) return iconClassName
    if (type === "success") return "text-green-500"
    if (type === "warning") return "text-yellow-500"
    if (type === "error") return "text-red-500"
    return "text-gray-400"
  }

  const FinalIcon = getIcon()

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <FinalIcon className={`mb-2 h-12 w-12 ${getIconClass()}`} />
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-gray-500 max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
