"use client"

import { useState, useEffect } from "react"

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("mensal")
  const [tabAtiva, setTabAtiva] = useState("vendas")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dadosRelatorios, setDadosRelatorios] = useState({
    vendas: {
      totais: 0,
      ticketMedio: 0,
      taxaConversao: 0,
      canceladas: 0,
      porProduto: [],
      porPeriodo: [],
    },
    clientes: {
      distribuicao: [],
    },
    produtos: {
      desempenho: [],
    },
    financeiro: {
      fluxoCaixa: [],
    },
  })

  useEffect(() => {
    const fetchDadosRelatorios = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/relatorios")

        if (!res.ok) {
          throw new Error("Erro ao buscar dados dos relatórios")
        }

        const data = await res.json()
        setDadosRelatorios(data)
      } catch (error) {
        console.error("Erro ao buscar dados dos relatórios:", error)
        setError("Não foi possível carregar os dados dos relatórios. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDadosRelatorios()
  }, [])

  // Função para formatar moeda
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

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
          <span style={{ marginLeft: "8px" }}>Carregando dados dos relatórios...</span>
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
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            border: "1px solid #dadce0",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Relatórios</h2>
        <p style={{ color: "#5f6368" }}>Visualize os dados e métricas do seu negócio</p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #dadce0",
            marginBottom: "16px",
            overflowX: "auto",
          }}
        >
          <button
            onClick={() => setTabAtiva("vendas")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "vendas" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "vendas" ? "500" : "normal",
              color: tabAtiva === "vendas" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Vendas
          </button>
          <button
            onClick={() => setTabAtiva("clientes")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "clientes" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "clientes" ? "500" : "normal",
              color: tabAtiva === "clientes" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Clientes
          </button>
          <button
            onClick={() => setTabAtiva("produtos")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "produtos" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "produtos" ? "500" : "normal",
              color: tabAtiva === "produtos" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Produtos
          </button>
          <button
            onClick={() => setTabAtiva("financeiro")}
            style={{
              padding: "12px 16px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: tabAtiva === "financeiro" ? "2px solid #1a73e8" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: tabAtiva === "financeiro" ? "500" : "normal",
              color: tabAtiva === "financeiro" ? "#1a73e8" : "#5f6368",
              whiteSpace: "nowrap",
            }}
          >
            Financeiro
          </button>
        </div>

        {/* Conteúdo da tab Vendas */}
        {tabAtiva === "vendas" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
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
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#5f6368" }}>Vendas Totais</span>
                  <span style={{ color: "#5f6368" }}>📊</span>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
                  {formatarMoeda(dadosRelatorios.vendas.totais)}
                </div>
                <p style={{ fontSize: "12px", color: "#5f6368", margin: 0 }}>+15% em relação ao período anterior</p>
              </div>

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
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#5f6368" }}>Ticket Médio</span>
                  <span style={{ color: "#5f6368" }}>📈</span>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
                  {formatarMoeda(dadosRelatorios.vendas.ticketMedio)}
                </div>
                <p style={{ fontSize: "12px", color: "#5f6368", margin: 0 }}>+5% em relação ao período anterior</p>
              </div>

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
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#5f6368" }}>Taxa de Conversão</span>
                  <span style={{ color: "#5f6368" }}>🍩</span>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
                  {dadosRelatorios.vendas.taxaConversao}%
                </div>
                <p style={{ fontSize: "12px", color: "#5f6368", margin: 0 }}>+2% em relação ao período anterior</p>
              </div>

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
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#5f6368" }}>Vendas Canceladas</span>
                  <span style={{ color: "#5f6368" }}>📉</span>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
                  {formatarMoeda(dadosRelatorios.vendas.canceladas)}
                </div>
                <p style={{ fontSize: "12px", color: "#5f6368", margin: 0 }}>-3% em relação ao período anterior</p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Desempenho de Vendas</h3>
                  <p style={{ fontSize: "14px", color: "#5f6368", margin: 0 }}>Análise de vendas por período</p>
                </div>
                <div>
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #dadce0",
                      borderRadius: "4px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>

              <div style={{ height: "300px", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5f6368",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>📊</span>
                  <span>Gráfico de desempenho de vendas por {periodo}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                padding: "20px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Vendas por Produto</h3>
              <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "16px" }}>
                Top 5 produtos mais vendidos no período
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {dadosRelatorios.vendas.porProduto && dadosRelatorios.vendas.porProduto.length > 0 ? (
                  dadosRelatorios.vendas.porProduto.map((item: any, index: number) => (
                    <div key={index} style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: "150px", fontWeight: "500" }}>{item.produto}</div>
                      <div
                        style={{
                          flex: "1",
                          height: "8px",
                          backgroundColor: "#e8f0fe",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${
                              (item.vendas / Math.max(...dadosRelatorios.vendas.porProduto.map((d: any) => d.vendas))) *
                              100
                            }%`,
                            height: "100%",
                            backgroundColor: "#1a73e8",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                      <div style={{ width: "80px", textAlign: "right", color: "#5f6368" }}>{item.vendas} un.</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "#5f6368" }}>Nenhum dado disponível</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da tab Clientes */}
        {tabAtiva === "clientes" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Distribuição de Clientes</h3>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "16px" }}>
              Análise da base de clientes por tipo
            </p>

            <div style={{ height: "300px", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5f6368",
                }}
              >
                <span style={{ marginRight: "8px" }}>🍩</span>
                <span>Gráfico de distribuição de clientes</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
              {dadosRelatorios.clientes.distribuicao && dadosRelatorios.clientes.distribuicao.length > 0 ? (
                dadosRelatorios.clientes.distribuicao.map((item: any, index: number) => (
                  <div key={index} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: index === 0 ? "#1a73e8" : "#34a853",
                        borderRadius: "4px",
                        display: "inline-block",
                        marginRight: "8px",
                      }}
                    ></div>
                    <span style={{ fontWeight: "500" }}>{item.tipo}</span>
                    <span style={{ color: "#5f6368", marginLeft: "8px" }}>{item.quantidade}</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#5f6368" }}>Nenhum dado disponível</div>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo da tab Produtos */}
        {tabAtiva === "produtos" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Desempenho de Produtos</h3>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "16px" }}>Análise de vendas por produto</p>

            <div style={{ height: "300px", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5f6368",
                }}
              >
                <span style={{ marginRight: "8px" }}>📊</span>
                <span>Gráfico de desempenho de produtos</span>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da tab Financeiro */}
        {tabAtiva === "financeiro" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Fluxo de Caixa</h3>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "16px" }}>Análise de receitas e despesas</p>

            <div style={{ height: "300px", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5f6368",
                }}
              >
                <span style={{ marginRight: "8px" }}>📈</span>
                <span>Gráfico de fluxo de caixa</span>
              </div>
            </div>
          </div>
        )}
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
