"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NovoProdutoDialog } from "@/components/dashboard/estoque/novo-produto-dialog"
import { MovimentarEstoqueDialog } from "@/components/dashboard/estoque/movimentar-estoque-dialog"

type Produto = {
  id: string
  nome: string
  codigo: string
  categoria: string
  status: string
  quantidadeEstoque: number
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [produtoDialogOpen, setProdutoDialogOpen] = useState(false)
  const [movimentarDialogOpen, setMovimentarDialogOpen] = useState(false)
  const router = useRouter()

  const fetchProdutos = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching products...")

      const res = await fetch("/api/estoque", {
        cache: "no-store",
        next: { revalidate: 0 },
      })

      if (!res.ok) {
        throw new Error(`Erro ao buscar produtos: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      console.log("Products fetched:", data)
      setProdutos(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Não foi possível carregar os produtos. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleProdutoAdicionado = (novoProduto: Produto) => {
    console.log("New product added:", novoProduto)
    setProdutos([...produtos, novoProduto])
    // Refresh the products list to ensure we have the latest data
    fetchProdutos()
  }

  const handleMovimentacaoRegistrada = () => {
    // Recarregar produtos após movimentação
    fetchProdutos()
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Estoque</h2>
            <p style={{ color: "#5f6368" }}>Gerencie o estoque de produtos</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setProdutoDialogOpen(true)}
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
              Novo Produto
            </button>
            <button
              onClick={() => setMovimentarDialogOpen(true)}
              style={{
                backgroundColor: "transparent",
                color: "#1a73e8",
                border: "1px solid #1a73e8",
                borderRadius: "4px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              <span style={{ fontSize: "16px" }}>↔</span>
              Movimentar Estoque
            </button>
          </div>
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
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Estoque Geral</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Lista de todos os produtos em estoque</p>
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
                  placeholder="Buscar produtos..."
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
              <p style={{ marginTop: "8px", color: "#5f6368" }}>Carregando produtos...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#d32f2f" }}>{error}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Nome</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Código</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Categoria</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Quantidade</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Status</th>
                    <th style={{ padding: "16px 8px", textAlign: "right", fontWeight: "500" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.length > 0 ? (
                    produtosFiltrados.map((produto) => (
                      <tr
                        key={produto.id}
                        style={{ borderBottom: "1px solid #e0e0e0", transition: "background-color 0.2s" }}
                      >
                        <td style={{ padding: "16px 8px", fontWeight: "500" }}>{produto.nome}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{produto.codigo}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{produto.categoria}</td>
                        <td style={{ padding: "16px 8px", fontWeight: "500" }}>{produto.quantidadeEstoque}</td>
                        <td style={{ padding: "16px 8px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              borderRadius: "16px",
                              padding: "4px 8px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor: produto.status === "Ativo" ? "#e6f4ea" : "#fdeded",
                              color: produto.status === "Ativo" ? "#137333" : "#c5221f",
                            }}
                          >
                            {produto.status}
                          </span>
                        </td>
                        <td style={{ padding: "16px 8px", textAlign: "right" }}>
                          <button
                            onClick={() => router.push(`/dashboard/estoque/${produto.id}`)}
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
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <NovoProdutoDialog
        open={produtoDialogOpen}
        onOpenChange={setProdutoDialogOpen}
        onProdutoAdicionado={handleProdutoAdicionado}
      />

      <MovimentarEstoqueDialog
        open={movimentarDialogOpen}
        onOpenChange={setMovimentarDialogOpen}
        onMovimentacaoRegistrada={handleMovimentacaoRegistrada}
        produtos={produtos}
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
