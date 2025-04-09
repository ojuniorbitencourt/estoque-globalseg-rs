"use client"

import type React from "react"

import { useAuth } from "@/components/client-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useTheme } from "next-themes"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
          color: isDarkMode ? "#e0e0e0" : "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              border: isDarkMode ? "2px solid #444" : "2px solid #e0e0e0",
              borderTopColor: "#1a73e8",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <span style={{ marginLeft: "8px" }}>Carregando...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          height: "64px",
          borderBottom: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          backgroundColor: isDarkMode ? "#1e1e1e" : "white",
          color: isDarkMode ? "#e0e0e0" : "inherit",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                display: "block",
                marginRight: "16px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: isDarkMode ? "#e0e0e0" : "inherit",
              }}
              className="md:hidden"
            >
              <span style={{ fontSize: "24px" }}>☰</span>
            </button>
            <div style={{ fontWeight: "bold", fontSize: "18px", marginRight: "24px" }}>Global Seg</div>
            <div style={{ display: "none" }} className="md:block">
              <MainNav />
            </div>
          </div>
          <UserNav />
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ display: "none" }} className="md:block md:w-64">
          <Sidebar />
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 50,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "80%",
                maxWidth: "300px",
                height: "100%",
                backgroundColor: isDarkMode ? "#1e1e1e" : "white",
                color: isDarkMode ? "#e0e0e0" : "inherit",
                zIndex: 51,
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <MobileNav onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
            color: isDarkMode ? "#e0e0e0" : "inherit",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
