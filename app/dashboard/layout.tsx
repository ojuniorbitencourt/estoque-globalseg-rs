"use client"

import type React from "react"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

// Simple sidebar component for now
function Sidebar() {
  return (
    <div className="hidden md:block w-64 border-r border-gray-800 bg-[#0a101f]">
      <div className="flex h-16 items-center border-b border-gray-800 px-4">
        <h2 className="text-lg font-semibold text-white">Global Seg</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <a
              href="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/dashboard/tecnicos"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Técnicos
            </a>
          </li>
          <li>
            <a
              href="/dashboard/estoque"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Estoque
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

// Simple mobile navigation component
function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full bg-[#0a101f]">
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        <h2 className="text-lg font-semibold text-white">Global Seg</h2>
        <button onClick={onClose} className="rounded-md p-1 hover:bg-gray-800 text-gray-300">
          Fechar
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <a
              href="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={onClose}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/dashboard/tecnicos"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={onClose}
            >
              Técnicos
            </a>
          </li>
          <li>
            <a
              href="/dashboard/estoque"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={onClose}
            >
              Estoque
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar para desktop */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Cabeçalho móvel */}
        <header className="flex h-14 items-center border-b bg-background px-4 lg:h-[60px] md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 text-center font-bold">Global Seg</div>
        </header>

        {/* Navegação móvel */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileNavOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background">
              <MobileNav onClose={() => setIsMobileNavOpen(false)} />
            </div>
          </div>
        )}

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
