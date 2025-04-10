"use client"

import type React from "react"

import { useAuth } from "@/components/client-provider"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [redirectAttempted, setRedirectAttempted] = useState(false)

  // Estado para controlar se a barra lateral está expandida
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  // Recuperar o estado da barra lateral do localStorage (apenas no cliente)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarExpanded")
      if (savedState !== null) {
        setIsSidebarExpanded(savedState === "true")
      }
    }
    setMounted(true)
  }, [])

  // Efeito para verificar autenticação e redirecionar se necessário
  useEffect(() => {
    // Só verificamos após o carregamento inicial e se ainda não tentamos redirecionar
    if (!isLoading && !user && !redirectAttempted) {
      console.log("Usuário não autenticado, redirecionando para login...")
      setRedirectAttempted(true)

      // Remover o cookie de autenticação
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

      // Redirecionar com parâmetro para evitar loop
      window.location.href = "/login?auth_failed=true"
    }
  }, [user, isLoading, redirectAttempted])

  // Renderização de carregamento inicial
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full animate-spin border-2 border-muted border-t-primary"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostra mensagem de redirecionamento
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full animate-spin border-2 border-muted border-t-primary"></div>
          <span className="ml-2">Redirecionando para login...</span>
        </div>
      </div>
    )
  }

  const isDarkMode = mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={cn(
          "h-16 flex items-center px-6 sticky top-0 z-10 border-b bg-background",
          isDarkMode ? "border-[#444]" : "border-[#e0e0e0]",
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden mr-4 bg-transparent border-none cursor-pointer p-2"
            >
              <span className="text-2xl">☰</span>
            </button>
            <div className="font-bold text-lg mr-6">Global Seg</div>
            <div className="hidden md:block">
              <MainNav />
            </div>
          </div>
          <UserNav />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block" style={{ transition: "width 0.3s ease" }}>
          <Sidebar />
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className={cn("fixed top-0 left-0 w-4/5 max-w-[300px] h-full z-51 overflow-y-auto bg-background")}
              onClick={(e) => e.stopPropagation()}
            >
              <MobileNav onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main
          className="flex-1 min-h-[calc(100vh-64px)] bg-muted"
          style={{
            transition: "padding-left 0.3s ease",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "16px",
            paddingBottom: "16px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
