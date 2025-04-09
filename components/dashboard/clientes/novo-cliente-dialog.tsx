"use client"

import type React from "react"

import { useState } from "react"

type NovoClienteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClienteAdicionado: (cliente: any) => void
}

export function NovoClienteDialog({ open, onOpenChange, onClienteAdicionado }: NovoClienteDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    codigoAgencia: "",
    email: "",
    telefone: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "SP",
    status: "Ativo",
    tipo: "Individual",
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
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erro ao adicionar cliente")
      }

      const data = await res.json()
      onClienteAdicionado(data)
      onOpenChange(false)
      setFormData({
        nome: "",
        codigoAgencia: "",
        email: "",
        telefone: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "SP",
        status: "Ativo",
        tipo: "Individual",
      })
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
      setError(error instanceof Error ? error.message : "Erro ao adicionar cliente")
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
            maxWidth: "550px",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "24px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Adicionar Cliente</h2>
              <p style={{ color: "#5f6368" }}>Preencha os dados para adicionar um novo cliente.</p>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
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
                  htmlFor="codigoAgencia"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Código da Agência
                </label>
                <input
                  id="codigoAgencia"
                  name="codigoAgencia"
                  value={formData.codigoAgencia}
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
                  htmlFor="email"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #dadce0",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="endereco"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Endereço
                </label>
                <input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
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
                  htmlFor="numero"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Número
                </label>
                <input
                  id="numero"
                  name="numero"
                  value={formData.numero}
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
                  htmlFor="bairro"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Bairro
                </label>
                <input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
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
                  htmlFor="cidade"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Cidade
                </label>
                <input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
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
                  htmlFor="estado"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
                >
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
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
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>

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
                  <option value="Individual">Individual</option>
                  <option value="Corporativo">Corporativo</option>
                </select>
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
