"use client"

import { useEffect } from "react"

export default function DashboardScript() {
  useEffect(() => {
    // Atualizar título da página com base na rota atual
    const updatePageTitle = () => {
      const path = window.location.pathname
      const segments = path.split("/")
      const lastSegment = segments[segments.length - 1]

      const headerTitle = document.querySelector(".header-title h1")
      const headerSubtitle = document.querySelector(".header-title p")

      if (headerTitle) {
        if (path === "/dashboard") {
          headerTitle.textContent = "Dashboard"
          if (headerSubtitle) {
            headerSubtitle.textContent = "Bem-vindo ao painel de controle da Global Seg"
          }
        } else {
          const title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
          headerTitle.textContent = title
          if (headerSubtitle) {
            headerSubtitle.textContent = ""
          }
        }
      }
    }

    updatePageTitle()

    // Marcar item ativo no menu
    const setActiveMenuItem = () => {
      const path = window.location.pathname
      const menuItems = document.querySelectorAll(".sidebar-nav li")

      menuItems.forEach((item) => {
        const link = item.querySelector("a")
        if (!link) return

        if (
          path === link.getAttribute("href") ||
          (path !== "/dashboard" &&
            link.getAttribute("href") !== "/dashboard" &&
            path.startsWith(link.getAttribute("href") || ""))
        ) {
          item.classList.add("active")
        } else {
          item.classList.remove("active")
        }
      })
    }

    setActiveMenuItem()

    // Botão de colapso da sidebar
    const collapseButton = document.querySelector(".collapse-button")
    if (collapseButton) {
      collapseButton.addEventListener("click", () => {
        const sidebar = document.querySelector(".sidebar")
        if (sidebar) {
          sidebar.classList.toggle("collapsed")
          const mainContent = document.querySelector(".main-content")
          if (mainContent) {
            mainContent.classList.toggle("expanded")
          }
        }
      })
    }

    // Limpar event listeners
    return () => {
      if (collapseButton) {
        collapseButton.removeEventListener("click", () => {})
      }
    }
  }, [])

  return null
}
