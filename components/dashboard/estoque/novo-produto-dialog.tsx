"use client"

import type React from "react"
import { useState } from "react"

type NovoProdutoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProdutoAdicionado: (produto: any) => void
}

export function NovoProdutoDialog({ open, onOpenChange, onProdutoAdicionado }: NovoProdutoDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    categoria: "",
    quantidadeEstoque: "0",
    status: "Ativo",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Submitting product data:", {
        ...formData,
        quantidadeEstoque: Number.parseInt(formData.quantidadeEstoque, 10),
      })

      const res = await fetch("/api/estoque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantidadeEstoque: Number.parseInt(formData.quantidadeEstoque, 10),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Error response:", data)
        throw new Error(data.error || "Erro ao adicionar produto")
      }

      console.log("Product added successfully:", data)
      onProdutoAdicionado(data)
      onOpenChange(false)
      setFormData({
        nome: "",
        codigo: "",
        categoria: "",
        quantidadeEstoque: "0",
        status: "Ativo",
      })
    } catch (error) {
      console.error("Error adding product:", error)
      setError(error instanceof Error ? error.message : "Erro ao adicionar produto")
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  // Categorias conforme solicitado
  const categorias = ["Loja", "PGDM", "ATM", "Cortinas"]

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
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Adicionar Produto</h2>
              <p style={{ color: "#5f6368" }}>Preencha os dados para adicionar um novo produto.</p>
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
                  htmlFor="nome"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  value={formData.nome}
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
                  htmlFor="codigo"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Código
                </label>
                <input
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
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
                  htmlFor="categoria"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
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
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantidadeEstoque"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Quantidade em Estoque
                </label>
                <input
                  id="quantidadeEstoque"
                  name="quantidadeEstoque"
                  type="number"
                  min="0"
                  value={formData.quantidadeEstoque}
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
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
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
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
