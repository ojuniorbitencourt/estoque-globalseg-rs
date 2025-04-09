"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Package, BarChart, Edit, Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type Produto = {
  id: string
  nome: string
  codigo: string
  categoria: string
  status: string
  quantidadeEstoque: number
  estoquesTecnicos: {
    id: string
    quantidade: number
    tecnico: {
      id: string
      user: {
        name: string
      }
    }
  }[]
  movimentacoes: {
    id: string
    quantidade: number
    tipo: string
    origem: string | null
    destino: string | null
    observacao: string | null
    createdAt: string
  }[]
}

export default function ProdutoDetalhesPage({ params }: { params: { id: string } }) {
  const [produto, setProduto] = useState<Produto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const id = params.id

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setIsLoading(true)
        console.log("Buscando produto com ID:", id)
        const res = await fetch(`/api/produtos/${id}`)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Erro desconhecido" }))
          throw new Error(errorData.error || "Erro ao buscar detalhes do produto")
        }

        const data = await res.json()
        console.log("Dados recebidos:", data)
        setProduto(data)
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error)
        setError(error instanceof Error ? error.message : "Erro ao buscar detalhes do produto")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduto()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex items-center">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
          <span className="ml-2">Carregando detalhes do produto...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-center text-red-500">{error}</div>
        <Button variant="outline" onClick={() => router.push("/dashboard/estoque")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Estoque
        </Button>
      </div>
    )
  }

  if (!produto) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-center">Produto não encontrado</div>
        <Button variant="outline" onClick={() => router.push("/dashboard/estoque")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Estoque
        </Button>
      </div>
    )
  }

  // Calcular quantidade total em estoque de técnicos
  const quantidadeTecnicos = produto.estoquesTecnicos?.reduce((acc, item) => acc + item.quantidade, 0) || 0
  const quantidadeTotal = produto.quantidadeEstoque + quantidadeTecnicos

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/estoque")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{produto.nome}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações do Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Nome:</dt>
                <dd>{produto.nome}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Código:</dt>
                <dd>{produto.codigo}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Categoria:</dt>
                <dd>{produto.categoria}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Status:</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      produto.status === "Ativo"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {produto.status}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Resumo do Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Estoque Geral:</dt>
                <dd>{produto.quantidadeEstoque} unidades</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Estoque com Técnicos:</dt>
                <dd>{quantidadeTecnicos} unidades</dd>
              </div>
              <Separator />
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Estoque Total:</dt>
                <dd className="font-bold">{quantidadeTotal} unidades</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribuicao">
        <TabsList>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
        </TabsList>
        <TabsContent value="distribuicao" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Distribuição do Estoque</CardTitle>
                <Button>Movimentar Estoque</Button>
              </div>
              <CardDescription>Distribuição do produto entre os técnicos</CardDescription>
            </CardHeader>
            <CardContent>
              {produto.estoquesTecnicos && produto.estoquesTecnicos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-medium">Técnico</th>
                        <th className="px-4 py-3 font-medium">Quantidade</th>
                        <th className="px-4 py-3 font-medium sr-only">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-muted/50 font-medium">
                        <td className="px-4 py-3">Estoque Geral</td>
                        <td className="px-4 py-3">{produto.quantidadeEstoque}</td>
                        <td className="px-4 py-3"></td>
                      </tr>
                      {produto.estoquesTecnicos.map((estoque) => (
                        <tr key={estoque.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{estoque.tecnico.user.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{estoque.quantidade}</td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/tecnicos/${estoque.tecnico.id}`)}
                            >
                              Ver Técnico
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted/50 font-medium">
                        <td className="px-4 py-3">Total</td>
                        <td className="px-4 py-3">{quantidadeTotal}</td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Este produto está apenas no estoque geral. Nenhum técnico possui este produto.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="movimentacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
              <CardDescription>Últimas movimentações deste produto</CardDescription>
            </CardHeader>
            <CardContent>
              {produto.movimentacoes && produto.movimentacoes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Quantidade</th>
                        <th className="px-4 py-3 font-medium">Origem</th>
                        <th className="px-4 py-3 font-medium">Destino</th>
                        <th className="px-4 py-3 font-medium">Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produto.movimentacoes.map((movimentacao) => (
                        <tr key={movimentacao.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatDate(new Date(movimentacao.createdAt))}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                movimentacao.tipo === "entrada"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : movimentacao.tipo === "saida"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {movimentacao.tipo === "entrada"
                                ? "Entrada"
                                : movimentacao.tipo === "saida"
                                  ? "Saída"
                                  : "Transferência"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">{movimentacao.quantidade}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {movimentacao.origem === "geral" ? "Estoque Geral" : movimentacao.origem ? "Técnico" : "-"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {movimentacao.destino === "geral"
                              ? "Estoque Geral"
                              : movimentacao.destino
                                ? "Técnico"
                                : "-"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{movimentacao.observacao || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">Nenhuma movimentação registrada</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
