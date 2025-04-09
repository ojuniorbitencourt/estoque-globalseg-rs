"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

type Produto = {
  id: string
  nome: string
  codigo: string
  quantidadeEstoque: number
}

type Tecnico = {
  id: string
  user: {
    name: string
  }
}

type NovoMovimentoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMovimentoRegistrado: () => void
  produtos: Produto[]
}

export function NovoMovimentoDialog({ open, onOpenChange, onMovimentoRegistrado, produtos }: NovoMovimentoDialogProps) {
  const [formData, setFormData] = useState({
    produtoId: "",
    quantidade: "1",
    tipo: "entrada",
    origem: "",
    destino: "",
    observacao: "",
  })
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      // Carregar técnicos quando o diálogo for aberto
      const fetchTecnicos = async () => {
        try {
          const res = await fetch("/api/tecnicos")
          if (res.ok) {
            const data = await res.json()
            setTecnicos(data)
          }
        } catch (error) {
          console.error("Erro ao carregar técnicos:", error)
        }
      }

      fetchTecnicos()
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }

      // Resetar origem e destino quando o tipo mudar
      if (name === "tipo") {
        newData.origem = ""
        newData.destino = ""
      }

      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/estoque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantidade: Number.parseInt(formData.quantidade),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar movimentação")
      }

      onMovimentoRegistrado()
      onOpenChange(false)
      setFormData({
        produtoId: "",
        quantidade: "1",
        tipo: "entrada",
        origem: "",
        destino: "",
        observacao: "",
      })
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error)
      setError(error instanceof Error ? error.message : "Erro ao registrar movimentação")
    } finally {
      setIsLoading(false)
    }
  }

  // Determinar quais campos mostrar com base no tipo de movimentação
  const mostrarOrigem = formData.tipo === "transferencia" || formData.tipo === "saida"
  const mostrarDestino = formData.tipo === "transferencia"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Movimentar Estoque</DialogTitle>
            <DialogDescription>Registre uma movimentação de estoque.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/30">{error}</div>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada no Estoque</SelectItem>
                  <SelectItem value="saida">Saída do Estoque</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="produtoId" className="text-right">
                Produto
              </Label>
              <Select value={formData.produtoId} onValueChange={(value) => handleSelectChange("produtoId", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.codigo}) - Estoque: {produto.quantidadeEstoque}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantidade" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {mostrarOrigem && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="origem" className="text-right">
                  Origem
                </Label>
                <Select value={formData.origem} onValueChange={(value) => handleSelectChange("origem", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.tipo === "transferencia" && <SelectItem value="geral">Estoque Geral</SelectItem>}
                    {tecnicos.map((tecnico) => (
                      <SelectItem key={tecnico.id} value={tecnico.id}>
                        {tecnico.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {mostrarDestino && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destino" className="text-right">
                  Destino
                </Label>
                <Select value={formData.destino} onValueChange={(value) => handleSelectChange("destino", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Estoque Geral</SelectItem>
                    {tecnicos.map((tecnico) => (
                      <SelectItem key={tecnico.id} value={tecnico.id}>
                        {tecnico.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observacao" className="text-right">
                Observação
              </Label>
              <Textarea
                id="observacao"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
