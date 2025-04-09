"use client"

import type React from "react"

import { useState, useEffect } from "react"

type Tecnico = {
  id: string
  user: {
    name: string
  }
}

type Produto = {
  id: string
  nome: string
  codigo: string
  quantidadeEstoque: number
}

type ItemAtendimento = {
  produtoId: string
  quantidade: number
  produto?: {
    nome: string
  }
}

type NovoAtendimentoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAtendimentoAdicionado: (atendimento: any) => void
}

export function NovoAtendimentoDialog({ open, onOpenChange, onAtendimentoAdicionado }: NovoAtendimentoDialogProps) {
  const [formData, setFormData] = useState({
    tecnicoId: "",
    dataAtendimento: new Date().toISOString().split("T")[0],
    local: "",
    status: "Concluído",
    descricao: "",
    observacoes: "",
  })
  const [itens, setItens] = useState<ItemAtendimento[]>([])
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      // Carregar técnicos e produtos quando o diálogo for aberto
      const fetchData = async () => {
        try {
          const [tecnicosRes, produtosRes] = await Promise.all([fetch("/api/tecnicos"), fetch("/api/estoque")])

          if (tecnicosRes.ok) {
            const tecnicosData = await tecnicosRes.json()
            setTecnicos(tecnicosData)
          }

          if (produtosRes.ok) {
            const produtosData = await produtosRes.json()
            setProdutos(produtosData)
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
        }
      }

      fetchData()
    } else {
      // Resetar o formulário quando o diálogo for fechado
      setFormData({
        tecnicoId: "",
        dataAtendimento: new Date().toISOString().split("T")[0],
        local: "",
        status: "Concluído",
        descricao: "",
        observacoes: "",
      })
      setItens([])
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    setItens([...itens, { produtoId: "", quantidade: 1 }])
  }

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItens = [...itens]

    if (field === "produtoId") {
      const produtoId = value
      const produto = produtos.find((p) => p.id === produtoId)

      newItens[index] = {
        ...newItens[index],
        produtoId,
        produto: produto ? { nome: produto.nome } : undefined,
      }
    } else if (field === "quantidade") {
      newItens[index] = {
        ...newItens[index],
        quantidade: Number.parseInt(value) || 1,
      }
    }

    setItens(newItens)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validar se há itens selecionados
    if (itens.length === 0) {
      setError("Adicione pelo menos um item ao atendimento")
      setIsLoading(false)
      return
    }

    // Validar se todos os itens têm produto selecionado
    const itemInvalido = itens.find((item) => !item.produtoId)
    if (itemInvalido) {
      setError("Selecione um produto para todos os itens")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/atendimentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          itens: itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          })),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erro ao registrar atendimento")
      }

      const data = await res.json()
      onAtendimentoAdicionado(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao registrar atendimento:", error)
      setError(error instanceof Error ? error.message : "Erro ao registrar atendimento")
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => onOpenChange(false)}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "24px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Novo Atendimento</h2>
              <p style={{ color: "#5f6368" }}>Registre um novo atendimento técnico.</p>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: "#fdeded",
                  color: "#c5221f",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label
                  htmlFor="tecnicoId"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Técnico
                </label>
                <select
                  id="tecnicoId"
                  name="tecnicoId"
                  value={formData.tecnicoId}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                    backgroundColor: "white",
                  }}
                  required
                >
                  <option value="">Selecione o técnico</option>
                  {tecnicos.map((tecnico) => (
                    <option key={tecnico.id} value={tecnico.id}>
                      {tecnico.user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="dataAtendimento"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Data
                </label>
                <input
                  id="dataAtendimento"
                  name="dataAtendimento"
                  type="date"
                  value={formData.dataAtendimento}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="local"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Local
                </label>
                <input
                  id="local"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                  placeholder="Endereço ou local do atendimento"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                    backgroundColor: "white",
                  }}
                  required
                >
                  <option value="Concluído">Concluído</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="descricao"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="observacoes"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label style={{ fontWeight: "500", fontSize: "14px" }}>Itens Utilizados</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    style={{
                      backgroundColor: "transparent",
                      color: "#1a73e8",
                      border: "1px solid #1a73e8",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    + Adicionar Item
                  </button>
                </div>

                {itens.length > 0 ? (
                  <div style={{ display: "grid", gap: "8px" }}>
                    {itens.map((item, index) => (
                      <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select
                          value={item.produtoId}
                          onChange={(e) => handleItemChange(index, "produtoId", e.target.value)}
                          style={{
                            flex: "1",
                            padding: "8px 12px",
                            border: "1px solid #dadce0",
                            borderRadius: "4px",
                            backgroundColor: "white",
                          }}
                          required
                        >
                          <option value="">Selecione o produto</option>
                          {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>
                              {produto.nome} ({produto.codigo}) - Estoque: {produto.quantidadeEstoque}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(index, "quantidade", e.target.value)}
                          style={{
                            width: "80px",
                            padding: "8px 12px",
                            border: "1px solid #dadce0",
                            borderRadius: "4px",
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#d32f2f",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      border: "1px dashed #dadce0",
                      borderRadius: "4px",
                      color: "#5f6368",
                    }}
                  >
                    Nenhum item adicionado. Clique em "Adicionar Item" para incluir produtos utilizados no atendimento.
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid #dadce0",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#1a73e8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Registrando..." : "Registrar Atendimento"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
