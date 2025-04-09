"use client"

import type React from "react"
import { useState, useEffect } from "react"

type Produto = {
  id: string
  nome: string
  codigo: string
  quantidadeEstoque: number
}

type Tecnico = {
  id: string
  user: {
    name: string
  }
}

type MovimentarEstoqueDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMovimentacaoRegistrada: () => void
  produtos: Produto[]
}

export function MovimentarEstoqueDialog({
  open,
  onOpenChange,
  onMovimentacaoRegistrada,
  produtos,
}: MovimentarEstoqueDialogProps) {
  const [formData, setFormData] = useState({
    produtoId: "",
    quantidade: "1",
    tipo: "entrada",
    origem: "",
    destino: "",
    observacao: "",
  })
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      // Carregar técnicos quando o diálogo for aberto
      const fetchTecnicos = async () => {
        try {
          const res = await fetch("/api/tecnicos")
          if (res.ok) {
            const data = await res.json()
            setTecnicos(data)
          }
        } catch (error) {
          console.error("Erro ao carregar técnicos:", error)
        }
      }

      fetchTecnicos()
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Submitting inventory movement:", {
        ...formData,
        quantidade: Number.parseInt(formData.quantidade, 10),
      })

      const res = await fetch("/api/estoque/movimentacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantidade: Number.parseInt(formData.quantidade, 10),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Error response:", data)
        throw new Error(data.error || "Erro ao registrar movimentação")
      }

      console.log("Movement registered successfully:", data)
      onMovimentacaoRegistrada()
      onOpenChange(false)
      setFormData({
        produtoId: "",
        quantidade: "1",
        tipo: "entrada",
        origem: "",
        destino: "",
        observacao: "",
      })
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error)
      setError(error instanceof Error ? error.message : "Erro ao registrar movimentação")
    } finally {
      setIsLoading(false)
    }
  }

  // Determinar quais campos mostrar com base no tipo de movimentação
  const mostrarOrigem = formData.tipo === "transferencia" || formData.tipo === "saida"
  const mostrarDestino = formData.tipo === "transferencia"

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
            maxWidth: "500px",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "24px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Movimentar Estoque</h2>
              <p style={{ color: "#5f6368" }}>Registre uma movimentação de estoque.</p>
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
                  htmlFor="tipo"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
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
                  <option value="entrada">Entrada no Estoque</option>
                  <option value="saida">Saída do Estoque</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="produtoId"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Produto
                </label>
                <select
                  id="produtoId"
                  name="produtoId"
                  value={formData.produtoId}
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
                  <option value="">Selecione o produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.codigo}) - Estoque: {produto.quantidadeEstoque}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantidade"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Quantidade
                </label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min="1"
                  value={formData.quantidade}
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

              {mostrarOrigem && (
                <div>
                  <label
                    htmlFor="origem"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                  >
                    Origem
                  </label>
                  <select
                    id="origem"
                    name="origem"
                    value={formData.origem}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #dadce0",
                      borderRadius: "4px",
                      backgroundColor: "white",
                    }}
                    required={mostrarOrigem}
                  >
                    <option value="">Selecione a origem</option>
                    {formData.tipo === "transferencia" && <option value="geral">Estoque Geral</option>}
                    {tecnicos.map((tecnico) => (
                      <option key={tecnico.id} value={tecnico.id}>
                        {tecnico.user.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {mostrarDestino && (
                <div>
                  <label
                    htmlFor="destino"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                  >
                    Destino
                  </label>
                  <select
                    id="destino"
                    name="destino"
                    value={formData.destino}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #dadce0",
                      borderRadius: "4px",
                      backgroundColor: "white",
                    }}
                    required={mostrarDestino}
                  >
                    <option value="">Selecione o destino</option>
                    <option value="geral">Estoque Geral</option>
                    {tecnicos.map((tecnico) => (
                      <option key={tecnico.id} value={tecnico.id}>
                        {tecnico.user.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="observacao"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Observação
                </label>
                <textarea
                  id="observacao"
                  name="observacao"
                  value={formData.observacao}
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
                {isLoading ? "Registrando..." : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
