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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowUpDown, Loader2 } from "lucide-react"

interface Produto {
  id: string
  nome: string
  codigo: string
  quantidade: number
}

interface TransferirItensDialogProps {
  tecnicoId: string
  produtosEstoque: Produto[]
  onTransferenciaRealizada: () => void
}

export function TransferirItensDialog({
  tecnicoId,
  produtosEstoque,
  onTransferenciaRealizada,
}: TransferirItensDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [produtoId, setProdutoId] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [destino, setDestino] = useState("geral")

  const resetForm = () => {
    setProdutoId("")
    setQuantidade(1)
    setDestino("geral")
  }

  const handleSubmit = async () => {
    if (!produtoId) {
      toast({
        title: "Erro",
        description: "Selecione um produto",
        variant: "destructive",
      })
      return
    }

    if (quantidade <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    // Verificar se há quantidade suficiente
    const produto = produtosEstoque.find((p) => p.id === produtoId)
    if (!produto || produto.quantidade < quantidade) {
      toast({
        title: "Erro",
        description: `Quantidade insuficiente. Disponível: ${produto?.quantidade || 0}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/estoque/movimentacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produtoId,
          quantidade,
          origem: tecnicoId,
          destino,
          tipo: "TRANSFERENCIA",
          observacao: "Transferência realizada pelo técnico",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao transferir itens")
      }

      toast({
        title: "Sucesso",
        description: "Itens transferidos com sucesso",
      })

      resetForm()
      setOpen(false)
      onTransferenciaRealizada()
    } catch (error) {
      console.error("Erro ao transferir itens:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao transferir itens",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Transferir Itens
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transferir Itens</DialogTitle>
          <DialogDescription>
            Transfira itens do estoque do técnico para o estoque geral ou outro técnico.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="produto">Produto</Label>
            <Select value={produtoId} onValueChange={setProdutoId}>
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
              value={quantidade}
              onChange={(e) => setQuantidade(Number.parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destino">Destino</Label>
            <Select value={destino} onValueChange={setDestino}>
              <SelectTrigger id="destino">
                <SelectValue placeholder="Selecione o destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Estoque Geral</SelectItem>
                {/* Aqui poderíamos adicionar outros técnicos como destino */}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
