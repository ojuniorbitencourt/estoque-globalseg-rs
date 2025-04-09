"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/client-provider"
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

export function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <div style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
          backgroundColor: isDarkMode ? "#1e1e1e" : "white",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "18px", color: isDarkMode ? "#e0e0e0" : "inherit" }}>
          Global Seg
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            fontSize: "18px",
            color: isDarkMode ? "#e0e0e0" : "inherit",
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          padding: "16px",
          borderBottom: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
          backgroundColor: isDarkMode ? "#1e1e1e" : "white",
        }}
      >
        <div style={{ fontWeight: "500", marginBottom: "4px", color: isDarkMode ? "#e0e0e0" : "inherit" }}>
          {user?.name}
        </div>
        <div style={{ fontSize: "14px", color: isDarkMode ? "#a0a0a0" : "#5f6368" }}>{user?.email}</div>
      </div>

      <nav style={{ padding: "16px 0", backgroundColor: isDarkMode ? "#1e1e1e" : "white" }}>
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
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
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

      <div style={{ padding: "16px", backgroundColor: isDarkMode ? "#1e1e1e" : "white" }}>
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "transparent",
            border: isDarkMode ? "1px solid #444" : "1px solid #dadce0",
            borderRadius: "4px",
            cursor: "pointer",
            color: isDarkMode ? "#e0e0e0" : "#5f6368",
            fontWeight: "500",
          }}
        >
          <span style={{ marginRight: "12px", fontSize: "18px" }}>🚪</span>
          Sair
        </button>
      </div>
    </div>
  )
}
