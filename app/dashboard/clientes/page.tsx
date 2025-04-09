"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NovoClienteDialog } from "@/components/dashboard/clientes/novo-cliente-dialog"

type Cliente = {
  id: string
  nome: string
  codigoAgencia: string
  email?: string
  telefone?: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  status: string
  tipo: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/clientes")

        if (!res.ok) {
          throw new Error("Erro ao buscar clientes")
        }

        const data = await res.json()
        setClientes(data)
      } catch (error) {
        console.error("Erro ao buscar clientes:", error)
        setError("Não foi possível carregar os clientes. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientes()
  }, [])

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase())) ||
      (cliente.telefone && cliente.telefone.includes(busca)) ||
      cliente.codigoAgencia.includes(busca),
  )

  const handleClienteAdicionado = (novoCliente: Cliente) => {
    setClientes([...clientes, novoCliente])
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Clientes</h2>
            <p style={{ color: "#5f6368" }}>Gerencie seus clientes e suas informações</p>
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
            Novo Cliente
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
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "4px" }}>Todos os Clientes</h3>
              <p style={{ fontSize: "14px", color: "#5f6368" }}>Lista de todos os clientes cadastrados no sistema</p>
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
                  placeholder="Buscar clientes..."
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
              <p style={{ marginTop: "8px", color: "#5f6368" }}>Carregando clientes...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#d32f2f" }}>{error}</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Nome</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Código Agência</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Email</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Telefone</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Endereço</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Cidade/UF</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Status</th>
                    <th style={{ padding: "16px 8px", textAlign: "left", fontWeight: "500" }}>Tipo</th>
                    <th style={{ padding: "16px 8px", textAlign: "right", fontWeight: "500" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((cliente) => (
                      <tr
                        key={cliente.id}
                        style={{ borderBottom: "1px solid #e0e0e0", transition: "background-color 0.2s" }}
                      >
                        <td style={{ padding: "16px 8px", fontWeight: "500" }}>{cliente.nome}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{cliente.codigoAgencia}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{cliente.email || "-"}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{cliente.telefone || "-"}</td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>
                          {`${cliente.endereco}, ${cliente.numero}`}
                        </td>
                        <td
                          style={{ padding: "16px 8px", color: "#5f6368" }}
                        >{`${cliente.cidade}/${cliente.estado}`}</td>
                        <td style={{ padding: "16px 8px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              borderRadius: "16px",
                              padding: "4px 8px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor: cliente.status === "Ativo" ? "#e6f4ea" : "#fdeded",
                              color: cliente.status === "Ativo" ? "#137333" : "#c5221f",
                            }}
                          >
                            {cliente.status}
                          </span>
                        </td>
                        <td style={{ padding: "16px 8px", color: "#5f6368" }}>{cliente.tipo}</td>
                        <td style={{ padding: "16px 8px", textAlign: "right" }}>
                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#1a73e8",
                              cursor: "pointer",
                              padding: "4px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} style={{ padding: "40px 0", textAlign: "center", color: "#5f6368" }}>
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <NovoClienteDialog open={dialogOpen} onOpenChange={setDialogOpen} onClienteAdicionado={handleClienteAdicionado} />

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
