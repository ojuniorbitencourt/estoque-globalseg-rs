"use client"

import { useState } from "react"
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
import { PlusCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
  const [error, setError] = useState<string | null>(null)

  const [dataAtendimento, setDataAtendimento] = useState("")
  const [local, setLocal] = useState("")
  const [status, setStatus] = useState("Concluído")
  const [descricao, setDescricao] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const [selectedProdutoId, setSelectedProdutoId] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [itensSelecionados, setItensSelecionados] = useState<{ produtoId: string; quantidade: number; nome: string }[]>(
    [],
  )

  const resetForm = () => {
    setDataAtendimento("")
    setLocal("")
    setStatus("Concluído")
    setDescricao("")
    setObservacoes("")
    setSelectedProdutoId("")
    setQuantidade(1)
    setItensSelecionados([])
    setError(null)
  }

  const handleAddItem = () => {
    if (!selectedProdutoId) {
      setError("Selecione um produto")
      return
    }

    if (quantidade <= 0) {
      setError("A quantidade deve ser maior que zero")
      return
    }

    const produto = produtosEstoque.find((p) => p.id === selectedProdutoId)
    if (!produto) {
      setError("Produto não encontrado")
      return
    }

    if (quantidade > produto.quantidade) {
      setError(`Quantidade indisponível. Disponível: ${produto.quantidade}`)
      return
    }

    // Verificar se o produto já está na lista
    const itemExistente = itensSelecionados.find((item) => item.produtoId === selectedProdutoId)
    if (itemExistente) {
      // Atualizar a quantidade se o produto já estiver na lista
      setItensSelecionados(
        itensSelecionados.map((item) =>
          item.produtoId === selectedProdutoId ? { ...item, quantidade: item.quantidade + quantidade } : item,
        ),
      )
    } else {
      // Adicionar novo item à lista
      setItensSelecionados([...itensSelecionados, { produtoId: selectedProdutoId, quantidade, nome: produto.nome }])
    }

    // Limpar seleção
    setSelectedProdutoId("")
    setQuantidade(1)
    setError(null)
  }

  const handleRemoveItem = (produtoId: string) => {
    setItensSelecionados(itensSelecionados.filter((item) => item.produtoId !== produtoId))
  }

  const handleSubmit = async () => {
    setError(null)

    // Validações
    if (!dataAtendimento) {
      setError("A data do atendimento é obrigatória")
      return
    }

    if (!local) {
      setError("O local do atendimento é obrigatório")
      return
    }

    if (!descricao) {
      setError("A descrição do atendimento é obrigatória")
      return
    }

    if (itensSelecionados.length === 0) {
      setError("Selecione pelo menos um produto")
      return
    }

    setLoading(true)

    try {
      const atendimentoData = {
        tecnicoId,
        dataAtendimento,
        local,
        status,
        descricao,
        observacoes,
        itens: itensSelecionados.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
      }

      console.log("Enviando dados:", atendimentoData)

      const response = await fetch("/api/atendimentos/tecnico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(atendimentoData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao registrar atendimento")
      }

      toast("Atendimento registrado com sucesso")
      setOpen(false)
      resetForm()
      onAtendimentoRegistrado()
    } catch (error) {
      console.error("Erro ao registrar atendimento:", error)
      setError(error instanceof Error ? error.message : "Erro ao registrar atendimento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Atendimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Novo Atendimento</DialogTitle>
          <DialogDescription>Preencha os dados do atendimento e selecione os produtos utilizados.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 dark:bg-red-900/30 dark:text-red-400">{error}</div>
        )}

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
                <SelectTrigger>
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
            <Input id="local" value={local} onChange={(e) => setLocal(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
          </div>

          <div className="space-y-4">
            <Label>Produtos Utilizados</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select value={selectedProdutoId} onValueChange={setSelectedProdutoId}>
                  <SelectTrigger>
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
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={handleAddItem} className="w-full">
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="border rounded-md p-2 mt-2">
              <h4 className="font-medium mb-2">Itens Selecionados</h4>
              {itensSelecionados.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum item selecionado</p>
              ) : (
                <div className="space-y-2">
                  {itensSelecionados.map((item) => (
                    <div key={item.produtoId} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span>
                        {item.nome} - {item.quantidade} unidades
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.produtoId)}
                        className="h-8 w-8 p-0"
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Registrar Atendimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
