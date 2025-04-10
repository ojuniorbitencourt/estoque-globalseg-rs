"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

export function Sidebar() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Estado para controlar se a barra lateral está expandida ou retraída
  const [isExpanded, setIsExpanded] = useState(true)

  // Recuperar o estado da barra lateral do localStorage (apenas no cliente)
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarExpanded")
    if (savedState !== null) {
      setIsExpanded(savedState === "true")
    }
  }, [])

  // Salvar o estado da barra lateral no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isExpanded.toString())
  }, [isExpanded])

  return (
    <div
      style={{
        width: isExpanded ? "240px" : "64px",
        height: "calc(100vh - 64px)",
        borderRight: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
        backgroundColor: isDarkMode ? "#1e1e1e" : "white",
        overflowY: "auto",
        position: "sticky",
        top: "64px",
        transition: "width 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "8px",
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            backgroundColor: isDarkMode ? "#2d2d2d" : "#f1f3f4",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: isDarkMode ? "#e0e0e0" : "#5f6368",
          }}
          title={isExpanded ? "Retrair menu" : "Expandir menu"}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav style={{ padding: "8px 0" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {navItems.map((item) => {
            // Check if the current path exactly matches the item's href or starts with it (for nested routes)
            // For the dashboard, we only want an exact match
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <li key={item.href} style={{ marginBottom: "4px" }}>
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: isExpanded ? "12px 24px" : "12px 0",
                    justifyContent: isExpanded ? "flex-start" : "center",
                    textDecoration: "none",
                    color: isActive ? "#1a73e8" : isDarkMode ? "#e0e0e0" : "#5f6368",
                    backgroundColor: isActive ? (isDarkMode ? "#2d2d2d" : "#e8f0fe") : "transparent",
                    fontWeight: isActive ? "500" : "normal",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                  title={item.label}
                >
                  <span
                    style={{
                      marginRight: isExpanded ? "12px" : "0",
                      fontSize: "18px",
                      minWidth: "24px",
                      textAlign: "center",
                    }}
                  >
                    {item.icon}
                  </span>
                  {isExpanded && item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
