"use client"

import { useAuth } from "@/components/client-provider"
import { useState, useRef, useEffect } from "react"

export function UserNav() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#1a73e8",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            marginRight: "8px",
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ textAlign: "left", display: "none" }} className="md:block">
          <div style={{ fontWeight: "500" }}>{user?.name}</div>
          <div style={{ fontSize: "12px", color: "#5f6368" }}>{user?.email}</div>
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            width: "240px",
            backgroundColor: "white",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
          }}
        >
          <div style={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ fontWeight: "500", marginBottom: "4px" }}>{user?.name}</div>
            <div style={{ fontSize: "14px", color: "#5f6368" }}>{user?.email}</div>
          </div>
          <div style={{ padding: "8px" }}>
            <button
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "8px",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ marginRight: "8px" }}>🚪</span>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
