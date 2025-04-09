"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Componente de card estatístico com estilos inline
function StatCard({
  title,
  value,
  description,
  icon,
}: { title: string; value: string | number; description: string; icon: string }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "500", color: "#5f6368" }}>{title}</span>
        <span style={{ color: "#5f6368" }}>{icon}</span>
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>{value}</div>
      <p style={{ fontSize: "12px", color: "#5f6368", margin: 0 }}>{description}</p>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dashboardData, setDashboardData] = useState<any>({
    resumo: {
      totalProdutos: 0,
      totalTecnicos: 0,
      totalClientes: 0,
      totalAtendimentos: 0,
      atendimentosEmAndamento: 0,
      produtosEstoqueBaixo: 0,
    },
    estoque: {
      produtosEstoqueBaixo: [],
    },
    atendimentos: {
      recentes: [],
    },
    vendas: {
      recentes: [],
    },
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError("")

        const res = await fetch("/api/dashboard", {
          // Evitar cache para sempre obter dados atualizados
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
          // Adicionar timeout para evitar requisições pendentes
          signal: AbortSignal.timeout(15000), // 15 segundos de timeout
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(
            `Falha ao carregar dados do dashboard: ${res.status} ${res.statusText} - ${errorData.error || ""}`,
          )
        }

        const data = await res.json()
        console.log("Dados do dashboard carregados:", data)
        setDashboardData(data)
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error)
        setError("Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          height: "50vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              border: "2px solid #e0e0e0",
              borderTopColor: "#1a73e8",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <span style={{ marginLeft: "8px" }}>Carregando dados do dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "50vh",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div style={{ textAlign: "center", color: "#d32f2f" }}>{error}</div>
        <button
          onClick={() => {
            setIsLoading(true)
            setError("")
            // Forçar atualização dos dados
            window.location.reload()
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const { resumo } = dashboardData

  // Função para formatar data
  const formatarData = (dataString: string) => {
    if (!dataString) return "N/A"
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Dashboard</h2>
        <p style={{ color: "#5f6368" }}>Visão geral do sistema</p>
      </div>

      {/* Cards principais */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          title="Total de Produtos"
          value={resumo.totalProdutos || 0}
          description={`${resumo.produtosEstoqueBaixo || 0} com estoque baixo`}
          icon="📦"
        />

        <StatCard
          title="Técnicos Ativos"
          value={resumo.totalTecnicos || 0}
          description="Equipe técnica disponível"
          icon="👥"
        />

        <StatCard title="Clientes" value={resumo.totalClientes || 0} description="Clientes cadastrados" icon="🏢" />

        <StatCard
          title="Atendimentos"
          value={resumo.totalAtendimentos || 0}
          description={`${resumo.atendimentosEmAndamento || 0} em andamento`}
          icon="📋"
        />
      </div>

      {/* Atendimentos Recentes */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Atendimentos Recentes</h3>
        <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "16px" }}>Últimos atendimentos registrados</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #dadce0", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Data</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Técnico</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Local</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Status</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.atendimentos.recentes && dashboardData.atendimentos.recentes.length > 0 ? (
                dashboardData.atendimentos.recentes.map((atendimento: any) => (
                  <tr
                    key={atendimento.id}
                    style={{ borderBottom: "1px solid #dadce0", transition: "background-color 0.2s" }}
                  >
                    <td style={{ padding: "12px 16px", color: "#5f6368" }}>
                      {formatarData(atendimento.dataAtendimento)}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: "500" }}>
                      {atendimento.tecnico?.user?.name || "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#5f6368" }}>{atendimento.local || "N/A"}</td>
                    <td style={{ padding: "12px 16px" }}>
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
                                : "#fef7e0",
                          color:
                            atendimento.status === "Concluído"
                              ? "#137333"
                              : atendimento.status === "Em Andamento"
                                ? "#1967d2"
                                : "#b06000",
                        }}
                      >
                        {atendimento.status || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
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
                  <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "#5f6368" }}>
                    Nenhum atendimento registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendas Recentes */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>Vendas Recentes</h3>
        <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "16px" }}>Últimas vendas realizadas</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #dadce0", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Data</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Cliente</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Produto</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Valor</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Status</th>
                <th style={{ padding: "12px 16px", fontWeight: "500" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.vendas?.recentes && dashboardData.vendas.recentes.length > 0 ? (
                dashboardData.vendas.recentes.map((venda: any) => (
                  <tr key={venda.id} style={{ borderBottom: "1px solid #dadce0", transition: "background-color 0.2s" }}>
                    <td style={{ padding: "12px 16px", color: "#5f6368" }}>{formatarData(venda.data)}</td>
                    <td style={{ padding: "12px 16px", fontWeight: "500" }}>{venda.cliente?.nome || "N/A"}</td>
                    <td style={{ padding: "12px 16px", color: "#5f6368" }}>{venda.produto?.nome || "N/A"}</td>
                    <td style={{ padding: "12px 16px", color: "#5f6368" }}>
                      {venda.valor ? `R$ ${venda.valor.toFixed(2).replace(".", ",")}` : "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "16px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor:
                            venda.status === "Concluída"
                              ? "#e6f4ea"
                              : venda.status === "Pendente"
                                ? "#fef7e0"
                                : "#fdeded",
                          color:
                            venda.status === "Concluída"
                              ? "#137333"
                              : venda.status === "Pendente"
                                ? "#b06000"
                                : "#c5221f",
                        }}
                      >
                        {venda.status || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => router.push(`/dashboard/vendas/${venda.id}`)}
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
                  <td colSpan={6} style={{ padding: "32px 16px", textAlign: "center", color: "#5f6368" }}>
                    Nenhuma venda registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
