"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

interface MobileNavProps {
  onClose: () => void
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/clientes", label: "Clientes", icon: "👥" },
  { href: "/dashboard/tecnicos", label: "Técnicos", icon: "🛠️" },
  { href: "/dashboard/estoque", label: "Estoque", icon: "📦" },
  { href: "/dashboard/atendimentos", label: "Atendimentos", icon: "📋" },
  { href: "/dashboard/vendas", label: "Vendas", icon: "💰" },
  { href: "/dashboard/relatorios", label: "Relatórios", icon: "📈" },
  { href: "/dashboard/documentos", label: "Documentos", icon: "📄" },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: "⚙️" },
]

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/dashboard" onClick={onClose}>
          <span className="font-bold text-lg">Global Seg</span>
        </Link>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted" aria-label="Fechar menu">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center p-3 rounded-md ${
                    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
