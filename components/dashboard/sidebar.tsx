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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Recuperar estado da sidebar do localStorage
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  // Salvar estado da sidebar no localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarCollapsed", String(isCollapsed))
    }
  }, [isCollapsed, mounted])

  if (!mounted) return null

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && <span>Global Seg</span>}
          {isCollapsed && <div className="sidebar-logo-icon">GS</div>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-menu-title">Menu</div>
        <ul className="sidebar-menu-items">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <li key={item.href} className="sidebar-menu-item">
                <Link href={item.href} className={`sidebar-menu-link ${isActive ? "active" : ""}`}>
                  <span className="sidebar-menu-icon">
                    <item.icon size={20} />
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
