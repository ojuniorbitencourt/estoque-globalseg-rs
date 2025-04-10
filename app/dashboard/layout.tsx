import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import "../dashboard/dashboard.css" // Importando o CSS específico do dashboard

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  )
}
