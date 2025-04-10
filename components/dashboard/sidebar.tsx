"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

// Definição dos itens de navegação com ícones do Lucide
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-10 dark:bg-gray-900 dark:border-gray-700">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg font-bold"
        >
          GS
        </Link>
      </div>

      <nav className="flex-1 w-full">
        <ul className="space-y-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <li key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                  )}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
