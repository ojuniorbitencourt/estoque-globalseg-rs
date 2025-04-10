"use client"

import { useEffect, useState } from "react"

export default function DashboardScript() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Restaurar o estado da sidebar do localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState === "true") {
      setSidebarCollapsed(true)
    }
  }, [])

  useEffect(() => {
    // Aplicar classes com base no estado
    const sidebar = document.querySelector(".sidebar")
    const mainContent = document.querySelector(".main-content")

    if (sidebar) {
      if (sidebarCollapsed) {
        sidebar.classList.add("collapsed")
      } else {
        sidebar.classList.remove("collapsed")
      }
    }

    if (mainContent) {
      if (sidebarCollapsed) {
        mainContent.classList.add("expanded")
      } else {
        mainContent.classList.remove("expanded")
      }
    }

    // Salvar o estado no localStorage
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed ? "true" : "false")
  }, [sidebarCollapsed])

  // Função para alternar o estado da sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <button
      className="collapse-button"
      onClick={toggleSidebar}
      style={{ position: "absolute", top: "20px", right: "16px", zIndex: 100 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  )
}
