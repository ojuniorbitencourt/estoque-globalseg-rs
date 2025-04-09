"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/clientes", label: "Clientes" },
  { href: "/dashboard/tecnicos", label: "Técnicos" },
  { href: "/dashboard/estoque", label: "Estoque" },
  { href: "/dashboard/atendimentos", label: "Atendimentos" },
]

export function MainNav() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <nav>
      <ul style={{ display: "flex", listStyle: "none", padding: 0, margin: 0 }}>
        {navItems.map((item) => {
          // Check if the current path exactly matches the item's href or starts with it (for nested routes)
          // For the dashboard, we only want an exact match
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  textDecoration: "none",
                  color: isActive ? "#1a73e8" : isDarkMode ? "#e0e0e0" : "#5f6368",
                  fontWeight: isActive ? "500" : "normal",
                }}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
