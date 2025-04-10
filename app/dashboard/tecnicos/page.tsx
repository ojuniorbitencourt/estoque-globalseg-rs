"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NovoTecnicoDialog } from "@/components/dashboard/tecnicos/novo-tecnico-dialog"

type Tecnico = {
  id: string
  user: {
    id: string
    name: string
    email?: string
    role: string
  }
  cargo: string
  status: string
}

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/tecnicos")

        if (!res.ok) {
          throw new Error("Erro ao buscar técnicos")
        }

        const data = await res.json()
        setTecnicos(data)
      } catch (error) {
        console.error("Erro ao buscar técnicos:", error)
        setError("Não foi possível carregar os técnicos. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTecnicos()
  }, [])

  const tecnicosFiltrados = tecnicos.filter((tecnico) => {
    // Verificar se o técnico e suas propriedades existem antes de acessá-las
    if (!tecnico || !tecnico.user) return false

    return (
      (tecnico.user.name && tecnico.user.name.toLowerCase().includes(busca.toLowerCase())) ||
      (tecnico.cargo && tecnico.cargo.toLowerCase().includes(busca.toLowerCase()))
    )
  })

  const handleTecnicoAdicionado = (novoTecnico: Tecnico) => {
    setTecnicos([...tecnicos, novoTecnico])
  }

  const handleVerDetalhes = (id: string) => {
    console.log("Navigating to technician details:", id)
    router.push(`/dashboard/tecnicos/${id}`)
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Técnicos</h2>
            <p style={{ color: "#5f6368" }}>Gerencie os técnicos da empresa</p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            style={{
              backgroundColor: "#1a73e8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            <span style={{ fontSize: "16px" }}>+</span>
            Novo Técnico
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Todos os Técnicos</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Lista de todos os técnicos cadastrados no sistema</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#5f6368",
                  }}
                >
                  🔍
                </span>
                <input
                  type="search"
                  placeholder="Buscar técnicos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{
                    padding: "8px 8px 8px 32px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                    width: "100%",
                    minWidth: "250px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 24px" }}>
          {isLoading ? (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  border: "2px solid #e0e0e0",
                  borderTopColor: "#1a73e8",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <p style={{ marginTop: "8px", color: "#5f6368" }}>Carregando técnicos...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#d32f2f" }}>{error}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Nome</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Cargo</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Status</th>
                    <th style={{ padding: "16px 8px", textAlign: "right", fontWeight: "500" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tecnicosFiltrados.length > 0 ? (
                    tecnicosFiltrados.map((tecnico) => (
                      <tr
                        key={tecnico.id}
                        style={{ borderBottom: "1px solid #e0e0e0", transition: "background-color 0.2s" }}
                      >
                        <td style={{ padding: "16px 8px", fontWeight: "500" }}>{tecnico.user.name}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{tecnico.cargo}</td>
                        <td style={{ padding: "16px 8px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              borderRadius: "16px",
                              padding: "4px 8px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor: tecnico.status === "Ativo" ? "#e6f4ea" : "#fdeded",
                              color: tecnico.status === "Ativo" ? "#137333" : "#c5221f",
                            }}
                          >
                            {tecnico.status}
                          </span>
                        </td>
                        <td style={{ padding: "16px 8px", textAlign: "right" }}>
                          <button
                            onClick={() => handleVerDetalhes(tecnico.id)}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#1a73e8",
                              cursor: "pointer",
                              padding: "4px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: "40px 0", textAlign: "center", color: "#5f6368" }}>
                        Nenhum técnico encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <NovoTecnicoDialog open={dialogOpen} onOpenChange={setDialogOpen} onTecnicoAdicionado={handleTecnicoAdicionado} />

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
