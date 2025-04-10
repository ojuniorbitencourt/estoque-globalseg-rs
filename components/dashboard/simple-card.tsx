import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"

interface SimpleCardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
  action?: {
    href: string
    label: string
  }
  className?: string
}

export function SimpleCard({ title, children, icon, action, className }: SimpleCardProps) {
  return (
    <div className={cn("bg-white border rounded-lg overflow-hidden dark:bg-gray-950 dark:border-gray-800", className)}>
      <div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
        <h2 className="text-base font-medium">{title}</h2>
        {icon}
      </div>
      <div className="p-4">{children}</div>
      {action && (
        <div className="border-t p-4 text-right dark:border-gray-800">
          <Link href={action.href} className="text-sm text-primary hover:underline">
            {action.label}
          </Link>
        </div>
      )}
    </div>
  )
}
