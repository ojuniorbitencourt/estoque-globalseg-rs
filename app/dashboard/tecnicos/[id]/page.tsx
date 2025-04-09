"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NovoAtendimentoTecnicoDialog } from "@/components/dashboard/tecnicos/novo-atendimento-tecnico-dialog"
import { TransferirItensDialog } from "@/components/dashboard/tecnicos/transferir-itens-dialog"
import { Edit, Trash2, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Tecnico {
  id: string
  nome: string
  email: string
  cargo: string
  especialidade: string
  status: string
  estoqueTecnico: {
    id: string
    produtoId: string
    produto: {
      id: string
      nome: string
      codigo: string
    }
    quantidade: number
  }[]
  atendimentos: {
    id: string
    dataAtendimento: string
    local: string
    status: string
    descricao: string
  }[]
}

interface ProdutoEstoque {
  id: string
  nome: string
  codigo: string
  quantidade: number
}

export default function TecnicoDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tecnico, setTecnico] = useState<Tecnico | null>(null)
  const [loading, setLoading] = useState(true)
  const [produtosEstoque, setProdutosEstoque] = useState<ProdutoEstoque[]>([])

  const fetchTecnico = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tecnicos/${params.id}`)
      if (!response.ok) {
        throw new Error("Erro ao carregar dados do técnico")
      }
      const data = await response.json()
      setTecnico(data)

      // Preparar produtos para os componentes de diálogo
      const produtos = data.estoqueTecnico.map((item: any) => ({
        id: item.produto.id,
        nome: item.produto.nome,
        codigo: item.produto.codigo,
        quantidade: item.quantidade,
      }))
      setProdutosEstoque(produtos)
    } catch (error) {
      console.error("Erro ao carregar técnico:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do técnico",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTecnico()
  }, [params.id])

  const handleEditar = () => {
    // Implementar edição do técnico
    toast({
      title: "Editar",
      description: "Funcionalidade de edição a ser implementada",
    })
  }

  const handleExcluir = async () => {
    if (!confirm("Tem certeza que deseja excluir este técnico?")) {
      return
    }

    try {
      const response = await fetch(`/api/tecnicos/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir técnico")
      }

      toast({
        title: "Sucesso",
        description: "Técnico excluído com sucesso",
      })

      router.push("/dashboard/tecnicos")
    } catch (error) {
      console.error("Erro ao excluir técnico:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o técnico",
        variant: "destructive",
      })
    }
  }

  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!tecnico) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Técnico não encontrado</h1>
        <Button onClick={() => router.push("/dashboard/tecnicos")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a lista
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/tecnicos")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">{tecnico.nome}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleEditar}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={handleExcluir}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informações do Técnico</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <span className="font-medium">Nome:</span>
              <span className="col-span-2">{tecnico.nome}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="font-medium">Email:</span>
              <span className="col-span-2">{tecnico.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="font-medium">Cargo:</span>
              <span className="col-span-2">{tecnico.cargo}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="font-medium">Especialidade:</span>
              <span className="col-span-2">{tecnico.especialidade}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="font-medium">Status:</span>
              <span className="col-span-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    tecnico.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {tecnico.status}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Resumo do Estoque</h2>
          <div className="mb-4">
            <p>Total de {tecnico.estoqueTecnico.length} itens em estoque</p>
          </div>
          <div className="flex space-x-2">
            <NovoAtendimentoTecnicoDialog
              tecnicoId={tecnico.id}
              produtosEstoque={produtosEstoque}
              onAtendimentoRegistrado={fetchTecnico}
            />
            <TransferirItensDialog
              tecnicoId={tecnico.id}
              produtosEstoque={produtosEstoque}
              onTransferenciaRealizada={fetchTecnico}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="estoque" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
        </TabsList>
        <TabsContent value="estoque" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Itens em Estoque</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Produto</th>
                  <th className="text-left py-2">Código</th>
                  <th className="text-left py-2">Quantidade</th>
                  <th className="text-left py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tecnico.estoqueTecnico.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Nenhum item em estoque
                    </td>
                  </tr>
                ) : (
                  tecnico.estoqueTecnico.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.produto.nome}</td>
                      <td className="py-2">{item.produto.codigo}</td>
                      <td className="py-2">{item.quantidade}</td>
                      <td className="py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Implementar ação de utilizar produto
                            toast({
                              title: "Utilizar produto",
                              description: "Use o botão 'Novo Atendimento' para registrar o uso de produtos",
                            })
                          }}
                        >
                          Utilizar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="atendimentos" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Atendimentos Realizados</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Data</th>
                  <th className="text-left py-2">Local</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {tecnico.atendimentos && tecnico.atendimentos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Nenhum atendimento registrado
                    </td>
                  </tr>
                ) : (
                  tecnico.atendimentos &&
                  tecnico.atendimentos.map((atendimento) => (
                    <tr key={atendimento.id} className="border-b">
                      <td className="py-2">{formatarData(atendimento.dataAtendimento)}</td>
                      <td className="py-2">{atendimento.local}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            atendimento.status === "Concluído"
                              ? "bg-green-100 text-green-800"
                              : atendimento.status === "Em Andamento"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {atendimento.status}
                        </span>
                      </td>
                      <td className="py-2">{atendimento.descricao}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
