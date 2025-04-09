"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

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

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 64px)",
        borderRight: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
        backgroundColor: isDarkMode ? "#1e1e1e" : "white",
        overflowY: "auto",
        position: "sticky",
        top: "64px",
      }}
    >
      <nav style={{ padding: "16px 0" }}>
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
                    padding: "12px 24px",
                    textDecoration: "none",
                    color: isActive ? "#1a73e8" : isDarkMode ? "#e0e0e0" : "#5f6368",
                    backgroundColor: isActive ? (isDarkMode ? "#2d2d2d" : "#e8f0fe") : "transparent",
                    fontWeight: isActive ? "500" : "normal",
                  }}
                >
                  <span style={{ marginRight: "12px", fontSize: "18px" }}>{item.icon}</span>
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
