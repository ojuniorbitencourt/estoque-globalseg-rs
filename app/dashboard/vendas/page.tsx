"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { FileText, Plus, Search } from "lucide-react"
import { useState } from "react"

// Dados de exemplo
const vendasIniciais = [
  {
    id: 1,
    cliente: "Empresa ABC Ltda",
    produto: "Seguro Empresarial Básico",
    valor: 5000.0,
    data: new Date(2023, 11, 15),
    status: "Concluída",
    pagamento: "Cartão de Crédito",
  },
  {
    id: 2,
    cliente: "João Silva",
    produto: "Seguro Automóvel Completo",
    valor: 2500.0,
    data: new Date(2023, 11, 14),
    status: "Concluída",
    pagamento: "Boleto",
  },
  {
    id: 3,
    cliente: "Distribuidora XYZ",
    produto: "Seguro Empresarial Premium",
    valor: 8500.0,
    data: new Date(2023, 11, 10),
    status: "Pendente",
    pagamento: "Transferência",
  },
  {
    id: 4,
    cliente: "Maria Oliveira",
    produto: "Seguro Residencial Premium",
    valor: 1200.0,
    data: new Date(2023, 11, 5),
    status: "Concluída",
    pagamento: "Pix",
  },
  {
    id: 5,
    cliente: "Comércio Rápido Ltda",
    produto: "Seguro Empresarial Básico",
    valor: 5000.0,
    data: new Date(2023, 11, 1),
    status: "Cancelada",
    pagamento: "Boleto",
  },
]

export default function VendasPage() {
  const [vendas, setVendas] = useState(vendasIniciais)
  const [busca, setBusca] = useState("")

  const vendasFiltradas = vendas.filter(
    (venda) =>
      venda.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      venda.produto.toLowerCase().includes(busca.toLowerCase()) ||
      venda.status.toLowerCase().includes(busca.toLowerCase()) ||
      venda.pagamento.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
          <p className="text-muted-foreground">Gerencie suas vendas e transações</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Venda
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Relatório
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>Lista de todas as vendas realizadas</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar vendas..."
                className="w-full pl-8 md:w-64"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Pagamento</th>
                  <th className="px-4 py-3 font-medium sr-only">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vendasFiltradas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">#{venda.id.toString().padStart(4, "0")}</td>
                    <td className="px-4 py-3">{venda.cliente}</td>
                    <td className="px-4 py-3 text-muted-foreground">{venda.produto}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(venda.valor)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(venda.data)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          venda.status === "Concluída"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : venda.status === "Pendente"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {venda.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{venda.pagamento}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
                {vendasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhuma venda encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
