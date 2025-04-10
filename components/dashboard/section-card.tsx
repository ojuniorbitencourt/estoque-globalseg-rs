import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SectionCardProps {
  title: string
  description?: string
  children: ReactNode
  actions?: {
    label: string
    href: string
  }[]
}

export function SectionCard({ title, description, children, actions }: SectionCardProps) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button key={index} variant="outline" size="sm" asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
