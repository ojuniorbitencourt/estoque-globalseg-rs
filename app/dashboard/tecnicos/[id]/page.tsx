"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NovoAtendimentoTecnicoDialog } from "@/components/dashboard/tecnicos/novo-atendimento-tecnico-dialog"
import { TransferirItensDialog } from "@/components/dashboard/tecnicos/transferir-itens-dialog"
import { ArrowLeft, Edit, Trash2, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

interface Tecnico {
  id: string
  nome: string
  cargo: string
  status: string
  estoqueTecnico: any[]
  atendimentos: any[]
}

interface Produto {
  id: string
  nome: string
  codigo: string
  quantidade: number
}

export default function TecnicoDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tecnico, setTecnico] = useState<Tecnico | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [produtosEstoque, setProdutosEstoque] = useState<Produto[]>([])

  // Acessar params.id diretamente, sem usar o hook use()
  const tecnicoId = params.id

  const fetchTecnico = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/tecnicos/${tecnicoId}`)
      if (!res.ok) {
        throw new Error("Erro ao buscar dados do técnico")
      }
      const data = await res.json()
      console.log("Dados do técnico:", data)

      // Mapear os dados do técnico para o formato esperado pelo componente
      const tecnicoData = {
        id: data.id,
        nome: data.user?.name || "N/A",
        cargo: data.cargo,
        status: data.status,
        estoqueTecnico: data.estoqueTecnico || [],
        atendimentos: data.atendimentos || [],
      }
      setTecnico(tecnicoData)

      // Preparar produtos para o diálogo de novo atendimento
      const produtos =
        data.estoqueTecnico?.map((item: any) => ({
          id: item.produtoId,
          nome: item.produto.nome,
          codigo: item.produto.codigo,
          quantidade: item.quantidade,
        })) || []
      setProdutosEstoque(produtos)
    } catch (error) {
      console.error("Erro ao buscar técnico:", error)
      setError("Não foi possível carregar os dados do técnico. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tecnicoId) {
      fetchTecnico()
    }
  }, [tecnicoId])

  const handleAtendimentoRegistrado = () => {
    fetchTecnico()
    toast("Atendimento registrado com sucesso")
  }

  const handleTransferenciaRealizada = () => {
    fetchTecnico()
    toast("Transferência realizada com sucesso")
  }

  const handleExcluir = async () => {
    if (confirm("Tem certeza que deseja excluir este técnico?")) {
      try {
        const res = await fetch(`/api/tecnicos/${tecnicoId}`, {
          method: "DELETE",
        })

        if (!res.ok) {
          throw new Error("Erro ao excluir técnico")
        }

        toast("Técnico excluído com sucesso")
        router.push("/dashboard/tecnicos")
      } catch (error) {
        console.error("Erro ao excluir técnico:", error)
        toast("Erro ao excluir técnico")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 dark:bg-red-900/30 dark:text-red-400">{error}</div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  if (!tecnico) {
    return (
      <div className="p-4">
        <div className="bg-amber-50 text-amber-700 p-4 rounded-md mb-4 dark:bg-amber-900/30 dark:text-amber-400">
          Técnico não encontrado
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTecnico}>
            <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button variant="destructive" onClick={handleExcluir}>
            <Trash2 className="mr-2 h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Técnico</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Nome:</span> {tecnico.nome}
            </div>
            <div>
              <span className="font-medium">Cargo:</span> {tecnico.cargo}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <Badge variant={tecnico.status === "Ativo" ? "success" : "destructive"}>{tecnico.status}</Badge>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Resumo do Estoque</h2>
          <div className="mb-4">
            <span className="font-medium">Total de {tecnico.estoqueTecnico.length} itens em estoque</span>
          </div>
          <div className="flex gap-2">
            <NovoAtendimentoTecnicoDialog
              tecnicoId={tecnico.id}
              produtosEstoque={produtosEstoque}
              onAtendimentoRegistrado={handleAtendimentoRegistrado}
            />
            <TransferirItensDialog
              tecnicoId={tecnico.id}
              produtosEstoque={produtosEstoque}
              onTransferenciaRealizada={handleTransferenciaRealizada}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="estoque" className="w-full">
        <TabsList>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
        </TabsList>
        <TabsContent value="estoque" className="border rounded-md p-4 mt-2">
          <h3 className="text-lg font-medium mb-4">Itens em Estoque</h3>
          {tecnico.estoqueTecnico.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">Nenhum item em estoque para este técnico</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Produto</th>
                    <th className="text-left py-2 px-4">Código</th>
                    <th className="text-right py-2 px-4">Quantidade</th>
                    <th className="text-right py-2 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tecnico.estoqueTecnico.map((item) => (
                    <tr key={item.produtoId} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{item.produto.nome}</td>
                      <td className="py-2 px-4">{item.produto.codigo}</td>
                      <td className="py-2 px-4 text-right">{item.quantidade}</td>
                      <td className="py-2 px-4 text-right">
                        <Button variant="outline" size="sm">
                          Utilizar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        <TabsContent value="atendimentos" className="border rounded-md p-4 mt-2">
          <h3 className="text-lg font-medium mb-4">Atendimentos Realizados</h3>
          {tecnico.atendimentos.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              Nenhum atendimento registrado para este técnico
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Data</th>
                    <th className="text-left py-2 px-4">Local</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Descrição</th>
                    <th className="text-right py-2 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tecnico.atendimentos.map((atendimento) => (
                    <tr key={atendimento.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">
                        {format(new Date(atendimento.dataAtendimento), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="py-2 px-4">{atendimento.local || "N/A"}</td>
                      <td className="py-2 px-4">
                        <Badge
                          variant={
                            atendimento.status === "Concluído"
                              ? "success"
                              : atendimento.status === "Em Andamento"
                                ? "warning"
                                : "default"
                          }
                        >
                          {atendimento.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-4">{atendimento.descricao}</td>
                      <td className="py-2 px-4 text-right">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
