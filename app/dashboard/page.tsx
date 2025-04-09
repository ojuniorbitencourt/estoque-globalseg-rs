"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { AlertTriangle, Package, Users, ClipboardList, ArrowRight } from "lucide-react"

// Tipos para os dados
type ProdutoEstoqueBaixo = {
  id: string
  nome: string
  codigo: string
  quantidadeEstoque: number
  estoqueMinimo: number
}

type EstoqueTecnico = {
  tecnicoId: string
  tecnicoNome: string
  produtoId: string
  produtoNome: string
  quantidade: number
}

type Atendimento = {
  id: string
  tecnicoNome: string
  dataAtendimento: string
  local: string
  status: string
}

type Venda = {
  id: string
  clienteNome: string
  produtoNome: string
  valor: number
  data: string
  status: string
}

export default function DashboardPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Estados para armazenar os dados
  const [totalProdutos, setTotalProdutos] = useState(0)
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState<ProdutoEstoqueBaixo[]>([])
  const [tecnicosAtivos, setTecnicosAtivos] = useState(0)
  const [totalClientes, setTotalClientes] = useState(0)
  const [atendimentosEmAndamento, setAtendimentosEmAndamento] = useState(0)
  const [atendimentosRecentes, setAtendimentosRecentes] = useState<Atendimento[]>([])
  const [vendasRecentes, setVendasRecentes] = useState<Venda[]>([])
  const [estoquesPorTecnico, setEstoquesPorTecnico] = useState<EstoqueTecnico[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Buscar dados do dashboard
        const dashboardRes = await fetch("/api/dashboard")
        const dashboardData = await dashboardRes.json()

        // Buscar produtos com estoque baixo
        const estoqueBaixoRes = await fetch("/api/estoque/baixo")
        const estoqueBaixoData = await estoqueBaixoRes.json()

        // Buscar estoque por técnico
        const estoqueTecnicoRes = await fetch("/api/estoque/tecnicos")
        const estoqueTecnicoData = await estoqueTecnicoRes.json()

        // Atualizar estados com os dados recebidos
        setTotalProdutos(dashboardData.totalProdutos || 0)
        setProdutosBaixoEstoque(estoqueBaixoData || [])
        setTecnicosAtivos(dashboardData.tecnicosAtivos || 0)
        setTotalClientes(dashboardData.totalClientes || 0)
        setAtendimentosEmAndamento(dashboardData.atendimentosEmAndamento || 0)
        setAtendimentosRecentes(dashboardData.atendimentosRecentes || [])
        setVendasRecentes(dashboardData.vendasRecentes || [])
        setEstoquesPorTecnico(estoqueTecnicoData || [])
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Estilos base
  const cardStyle = {
    backgroundColor: isDarkMode ? "#1e1e1e" : "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  }

  const cardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  }

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "500",
    color: isDarkMode ? "#e0e0e0" : "#202124",
  }

  const tableHeaderStyle = {
    padding: "12px 16px",
    textAlign: "left" as const,
    fontWeight: "500",
    borderBottom: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
    color: isDarkMode ? "#e0e0e0" : "#5f6368",
  }

  const tableCellStyle = {
    padding: "12px 16px",
    borderBottom: isDarkMode ? "1px solid #444" : "1px solid #e0e0e0",
    color: isDarkMode ? "#e0e0e0" : "#202124",
  }

  const statusStyle = (status: string) => ({
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "16px",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor:
      status === "Concluído" || status === "Ativo" || status === "Pago"
        ? isDarkMode
          ? "#0f3d29"
          : "#e6f4ea"
        : isDarkMode
          ? "#3d2c0f"
          : "#fef7e0",
    color:
      status === "Concluído" || status === "Ativo" || status === "Pago"
        ? isDarkMode
          ? "#81c995"
          : "#137333"
        : isDarkMode
          ? "#fdd663"
          : "#b06000",
  })

  const alertStyle = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "16px",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor: isDarkMode ? "#3d1a1a" : "#fdeded",
    color: isDarkMode ? "#f28b82" : "#c5221f",
  }

  const linkStyle = {
    color: isDarkMode ? "#8ab4f8" : "#1a73e8",
    textDecoration: "none",
  }

  const viewAllStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: isDarkMode ? "#8ab4f8" : "#1a73e8",
    textDecoration: "none",
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
          backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
          color: isDarkMode ? "#e0e0e0" : "#202124",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              border: isDarkMode ? "2px solid #444" : "2px solid #e0e0e0",
              borderTopColor: "#1a73e8",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <span style={{ marginLeft: "8px" }}>Carregando dados do dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#e0e0e0" : "#202124",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Dashboard</h1>
        <p style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368" }}>Visão geral do sistema</p>
      </div>

      {/* Cards de estatísticas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Card de Produtos */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368", fontSize: "14px" }}>Total de Produtos</div>
            <Package size={20} color={isDarkMode ? "#9aa0a6" : "#5f6368"} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>{totalProdutos}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color:
                produtosBaixoEstoque.length > 0
                  ? isDarkMode
                    ? "#f28b82"
                    : "#c5221f"
                  : isDarkMode
                    ? "#9aa0a6"
                    : "#5f6368",
              fontSize: "14px",
            }}
          >
            {produtosBaixoEstoque.length > 0 && <AlertTriangle size={16} style={{ marginRight: "4px" }} />}
            {produtosBaixoEstoque.length} com estoque baixo
          </div>
        </div>

        {/* Card de Técnicos */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368", fontSize: "14px" }}>Técnicos Ativos</div>
            <Users size={20} color={isDarkMode ? "#9aa0a6" : "#5f6368"} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>{tecnicosAtivos}</div>
          <div style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368", fontSize: "14px" }}>Equipe técnica disponível</div>
        </div>

        {/* Card de Clientes */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368", fontSize: "14px" }}>Clientes</div>
            <Users size={20} color={isDarkMode ? "#9aa0a6" : "#5f6368"} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>{totalClientes}</div>
          <div style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368", fontSize: "14px" }}>Clientes cadastrados</div>
        </div>

        {/* Card de Atendimentos */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368", fontSize: "14px" }}>Atendimentos</div>
            <ClipboardList size={20} color={isDarkMode ? "#9aa0a6" : "#5f6368"} />
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>{atendimentosRecentes.length}</div>
          <div style={{ color: isDarkMode ? "#9aa0a6" : "#5f6368", fontSize: "14px" }}>
            {atendimentosEmAndamento} em andamento
          </div>
        </div>
      </div>

      {/* Seção de Produtos com Estoque Baixo */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <div style={cardHeaderStyle}>
          <div>
            <h2 style={cardTitleStyle}>Produtos com Estoque Baixo</h2>
            <p style={{ fontSize: "14px", color: isDarkMode ? "#9aa0a6" : "#5f6368" }}>
              Produtos que precisam de reposição
            </p>
          </div>
          <Link href="/dashboard/estoque" style={viewAllStyle}>
            <span>Ver todos</span>
            <ArrowRight size={16} style={{ marginLeft: "4px" }} />
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Código</th>
                <th style={tableHeaderStyle}>Produto</th>
                <th style={tableHeaderStyle}>Estoque Atual</th>
                <th style={tableHeaderStyle}>Estoque Mínimo</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosBaixoEstoque.length > 0 ? (
                produtosBaixoEstoque.map((produto) => (
                  <tr key={produto.id}>
                    <td style={tableCellStyle}>{produto.codigo}</td>
                    <td style={tableCellStyle}>{produto.nome}</td>
                    <td style={tableCellStyle}>{produto.quantidadeEstoque}</td>
                    <td style={tableCellStyle}>{produto.estoqueMinimo}</td>
                    <td style={tableCellStyle}>
                      <span style={alertStyle}>
                        <AlertTriangle size={12} style={{ marginRight: "4px" }} />
                        Estoque Baixo
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <Link href={`/dashboard/estoque/produtos/${produto.id}`} style={linkStyle}>
                        Repor Estoque
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ ...tableCellStyle, textAlign: "center" }}>
                    Nenhum produto com estoque baixo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção de Estoque por Técnico */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <div style={cardHeaderStyle}>
          <div>
            <h2 style={cardTitleStyle}>Estoque por Técnico</h2>
            <p style={{ fontSize: "14px", color: isDarkMode ? "#9aa0a6" : "#5f6368" }}>
              Produtos em estoque com cada técnico
            </p>
          </div>
          <Link href="/dashboard/estoque/tecnicos" style={viewAllStyle}>
            <span>Ver todos</span>
            <ArrowRight size={16} style={{ marginLeft: "4px" }} />
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Técnico</th>
                <th style={tableHeaderStyle}>Produto</th>
                <th style={tableHeaderStyle}>Quantidade</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {estoquesPorTecnico.length > 0 ? (
                estoquesPorTecnico.map((estoque, index) => (
                  <tr key={`${estoque.tecnicoId}-${estoque.produtoId}-${index}`}>
                    <td style={tableCellStyle}>{estoque.tecnicoNome}</td>
                    <td style={tableCellStyle}>{estoque.produtoNome}</td>
                    <td style={tableCellStyle}>{estoque.quantidade}</td>
                    <td style={tableCellStyle}>
                      <Link href={`/dashboard/tecnicos/${estoque.tecnicoId}/estoque`} style={linkStyle}>
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ ...tableCellStyle, textAlign: "center" }}>
                    Nenhum item em estoque com técnicos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção de Atendimentos Recentes */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <div style={cardHeaderStyle}>
          <div>
            <h2 style={cardTitleStyle}>Atendimentos Recentes</h2>
            <p style={{ fontSize: "14px", color: isDarkMode ? "#9aa0a6" : "#5f6368" }}>
              Últimos atendimentos registrados
            </p>
          </div>
          <Link href="/dashboard/atendimentos" style={viewAllStyle}>
            <span>Ver todos</span>
            <ArrowRight size={16} style={{ marginLeft: "4px" }} />
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Data</th>
                <th style={tableHeaderStyle}>Técnico</th>
                <th style={tableHeaderStyle}>Local</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atendimentosRecentes.length > 0 ? (
                atendimentosRecentes.map((atendimento) => (
                  <tr key={atendimento.id}>
                    <td style={tableCellStyle}>{atendimento.dataAtendimento}</td>
                    <td style={tableCellStyle}>{atendimento.tecnicoNome}</td>
                    <td style={tableCellStyle}>{atendimento.local || "N/A"}</td>
                    <td style={tableCellStyle}>
                      <span style={statusStyle(atendimento.status)}>{atendimento.status}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <Link href={`/dashboard/atendimentos/${atendimento.id}`} style={linkStyle}>
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ ...tableCellStyle, textAlign: "center" }}>
                    Nenhum atendimento registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção de Vendas Recentes */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <div>
            <h2 style={cardTitleStyle}>Vendas Recentes</h2>
            <p style={{ fontSize: "14px", color: isDarkMode ? "#9aa0a6" : "#5f6368" }}>Últimas vendas realizadas</p>
          </div>
          <Link href="/dashboard/vendas" style={viewAllStyle}>
            <span>Ver todos</span>
            <ArrowRight size={16} style={{ marginLeft: "4px" }} />
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Data</th>
                <th style={tableHeaderStyle}>Cliente</th>
                <th style={tableHeaderStyle}>Produto</th>
                <th style={tableHeaderStyle}>Valor</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasRecentes.length > 0 ? (
                vendasRecentes.map((venda) => (
                  <tr key={venda.id}>
                    <td style={tableCellStyle}>{venda.data}</td>
                    <td style={tableCellStyle}>{venda.clienteNome}</td>
                    <td style={tableCellStyle}>{venda.produtoNome}</td>
                    <td style={tableCellStyle}>R$ {venda.valor.toFixed(2)}</td>
                    <td style={tableCellStyle}>
                      <span style={statusStyle(venda.status)}>{venda.status}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <Link href={`/dashboard/vendas/${venda.id}`} style={linkStyle}>
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ ...tableCellStyle, textAlign: "center" }}>
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
