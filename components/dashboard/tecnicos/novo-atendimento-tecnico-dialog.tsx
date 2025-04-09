"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Loader2 } from "lucide-react"

interface Produto {
  id: string
  nome: string
  codigo: string
  quantidade: number
}

interface NovoAtendimentoTecnicoDialogProps {
  tecnicoId: string
  produtosEstoque: Produto[]
  onAtendimentoRegistrado: () => void
}

export function NovoAtendimentoTecnicoDialog({
  tecnicoId,
  produtosEstoque,
  onAtendimentoRegistrado,
}: NovoAtendimentoTecnicoDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataAtendimento, setDataAtendimento] = useState("")
  const [local, setLocal] = useState("")
  const [status, setStatus] = useState("Concluído")
  const [descricao, setDescricao] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [itensSelecionados, setItensSelecionados] = useState<{ produtoId: string; quantidade: number }[]>([])
  const [produtoAtual, setProdutoAtual] = useState("")
  const [quantidadeAtual, setQuantidadeAtual] = useState(1)

  useEffect(() => {
    // Definir a data atual como padrão
    const hoje = new Date()
    const dataFormatada = hoje.toISOString().split("T")[0]
    setDataAtendimento(dataFormatada)
  }, [])

  const resetForm = () => {
    const hoje = new Date()
    const dataFormatada = hoje.toISOString().split("T")[0]
    setDataAtendimento(dataFormatada)
    setLocal("")
    setStatus("Concluído")
    setDescricao("")
    setObservacoes("")
    setItensSelecionados([])
    setProdutoAtual("")
    setQuantidadeAtual(1)
  }

  const adicionarItem = () => {
    if (!produtoAtual) {
      toast({
        title: "Erro",
        description: "Selecione um produto",
        variant: "destructive",
      })
      return
    }

    if (quantidadeAtual <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    // Verificar se o produto já está na lista
    const itemExistente = itensSelecionados.find((item) => item.produtoId === produtoAtual)
    if (itemExistente) {
      // Atualizar a quantidade
      setItensSelecionados(
        itensSelecionados.map((item) =>
          item.produtoId === produtoAtual ? { ...item, quantidade: item.quantidade + quantidadeAtual } : item,
        ),
      )
    } else {
      // Adicionar novo item
      setItensSelecionados([...itensSelecionados, { produtoId: produtoAtual, quantidade: quantidadeAtual }])
    }

    // Resetar campos
    setProdutoAtual("")
    setQuantidadeAtual(1)
  }

  const removerItem = (produtoId: string) => {
    setItensSelecionados(itensSelecionados.filter((item) => item.produtoId !== produtoId))
  }

  const getProdutoNome = (produtoId: string) => {
    const produto = produtosEstoque.find((p) => p.id === produtoId)
    return produto ? produto.nome : "Produto não encontrado"
  }

  const getEstoqueDisponivel = (produtoId: string) => {
    const produto = produtosEstoque.find((p) => p.id === produtoId)
    return produto ? produto.quantidade : 0
  }

  const handleSubmit = async () => {
    if (!local) {
      toast({
        title: "Erro",
        description: "O local é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!descricao) {
      toast({
        title: "Erro",
        description: "A descrição é obrigatória",
        variant: "destructive",
      })
      return
    }

    if (itensSelecionados.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item",
        variant: "destructive",
      })
      return
    }

    // Verificar se há quantidade suficiente para cada item
    for (const item of itensSelecionados) {
      const estoqueDisponivel = getEstoqueDisponivel(item.produtoId)
      if (item.quantidade > estoqueDisponivel) {
        toast({
          title: "Erro",
          description: `Quantidade insuficiente para ${getProdutoNome(item.produtoId)}. Disponível: ${estoqueDisponivel}`,
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch("/api/atendimentos/tecnico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tecnicoId,
          dataAtendimento,
          local,
          status,
          descricao,
          observacoes,
          itens: itensSelecionados,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao registrar atendimento")
      }

      toast({
        title: "Sucesso",
        description: "Atendimento registrado com sucesso",
      })

      resetForm()
      setOpen(false)
      onAtendimentoRegistrado()
    } catch (error) {
      console.error("Erro ao registrar atendimento:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao registrar atendimento",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Atendimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Novo Atendimento</DialogTitle>
          <DialogDescription>Preencha os dados do atendimento e selecione os produtos utilizados.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataAtendimento">Data do Atendimento</Label>
              <Input
                id="dataAtendimento"
                type="date"
                value={dataAtendimento}
                onChange={(e) => setDataAtendimento(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="local">Local</Label>
            <Input
              id="local"
              placeholder="Local do atendimento"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o atendimento"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="font-medium">Produtos Utilizados</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select value={produtoAtual} onValueChange={setProdutoAtual}>
                  <SelectTrigger id="produto">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtosEstoque.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome} ({produto.quantidade} disponíveis)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  value={quantidadeAtual}
                  onChange={(e) => setQuantidadeAtual(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={adicionarItem}>
                  Adicionar
                </Button>
              </div>
            </div>

            {itensSelecionados.length > 0 && (
              <div className="border rounded-md p-4 mt-4">
                <div className="font-medium mb-2">Itens Selecionados</div>
                <div className="space-y-2">
                  {itensSelecionados.map((item) => (
                    <div key={item.produtoId} className="flex justify-between items-center">
                      <div>
                        {getProdutoNome(item.produtoId)} - {item.quantidade} unidades
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removerItem(item.produtoId)}>
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar Atendimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
