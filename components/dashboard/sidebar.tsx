"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Wrench,
  Package,
  ClipboardList,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/tecnicos", label: "Técnicos", icon: Wrench },
  { href: "/dashboard/estoque", label: "Estoque", icon: Package },
  { href: "/dashboard/atendimentos", label: "Atendimentos", icon: ClipboardList },
  { href: "/dashboard/vendas", label: "Vendas", icon: DollarSign },
  { href: "/dashboard/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 border-r bg-white">
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white font-semibold">
            GS
          </div>
          <span className="text-lg font-semibold">Global Seg</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium">Global Seg ERP</p>
            <p className="text-xs text-gray-500">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
