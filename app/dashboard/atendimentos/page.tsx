"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NovoAtendimentoDialog } from "@/components/dashboard/atendimentos/novo-atendimento-dialog"

type Atendimento = {
  id: string
  tecnico: {
    id: string
    user: {
      name: string
    }
  }
  dataAtendimento: string
  local: string
  status: string
  descricao: string
  itens: {
    id: string
    quantidade: number
    produto: {
      id: string
      nome: string
      codigo: string
    }
  }[]
}

export default function AtendimentosPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAtendimentos = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/atendimentos")

        if (!res.ok) {
          throw new Error("Erro ao buscar atendimentos")
        }

        const data = await res.json()
        setAtendimentos(data)
      } catch (error) {
        console.error("Erro ao buscar atendimentos:", error)
        setError("Não foi possível carregar os atendimentos. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAtendimentos()
  }, [])

  const atendimentosFiltrados = atendimentos.filter((atendimento) => {
    // Verificar se o atendimento e suas propriedades existem antes de acessá-las
    if (!atendimento || !atendimento.tecnico) return false

    return (
      (atendimento.tecnico.user.name && atendimento.tecnico.user.name.toLowerCase().includes(busca.toLowerCase())) ||
      (atendimento.descricao && atendimento.descricao.toLowerCase().includes(busca.toLowerCase())) ||
      (atendimento.local && atendimento.local.toLowerCase().includes(busca.toLowerCase())) ||
      (atendimento.status && atendimento.status.toLowerCase().includes(busca.toLowerCase()))
    )
  })

  const handleAtendimentoAdicionado = (novoAtendimento: Atendimento) => {
    setAtendimentos([novoAtendimento, ...atendimentos])
  }

  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Atendimentos</h2>
            <p style={{ color: "#5f6368" }}>Gerencie os atendimentos técnicos</p>
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
            Novo Atendimento
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
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Todos os Atendimentos</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Lista de todos os atendimentos registrados</p>
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
                  placeholder="Buscar atendimentos..."
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
              <p style={{ marginTop: "8px", color: "#5f6368" }}>Carregando atendimentos...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#d32f2f" }}>{error}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Técnico</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Data</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Local</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Descrição</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Status</th>
                    <th style={{ padding: "16px 8px", textAlign: "right", fontWeight: "500" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {atendimentosFiltrados.length > 0 ? (
                    atendimentosFiltrados.map((atendimento) => (
                      <tr
                        key={atendimento.id}
                        style={{ borderBottom: "1px solid #e0e0e0", transition: "background-color 0.2s" }}
                      >
                        <td style={{ padding: "16px 8px", fontWeight: "500" }}>{atendimento.tecnico.user.name}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>
                          {formatarData(atendimento.dataAtendimento)}
                        </td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{atendimento.local}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>
                          {atendimento.descricao.length > 30
                            ? `${atendimento.descricao.substring(0, 30)}...`
                            : atendimento.descricao}
                        </td>
                        <td style={{ padding: "16px 8px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              borderRadius: "16px",
                              padding: "4px 8px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor:
                                atendimento.status === "Concluído"
                                  ? "#e6f4ea"
                                  : atendimento.status === "Em Andamento"
                                    ? "#e8f0fe"
                                    : "#fdeded",
                              color:
                                atendimento.status === "Concluído"
                                  ? "#137333"
                                  : atendimento.status === "Em Andamento"
                                    ? "#1967d2"
                                    : "#c5221f",
                            }}
                          >
                            {atendimento.status}
                          </span>
                        </td>
                        <td style={{ padding: "16px 8px", textAlign: "right" }}>
                          <button
                            onClick={() => router.push(`/dashboard/atendimentos/${atendimento.id}`)}
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
                      <td colSpan={6} style={{ padding: "40px 0", textAlign: "center", color: "#5f6368" }}>
                        Nenhum atendimento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <NovoAtendimentoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAtendimentoAdicionado={handleAtendimentoAdicionado}
      />

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
