"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

type MovimentarEstoqueDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMovimentacaoRegistrada: () => void
  produtos: Produto[]
}

export function MovimentarEstoqueDialog({
  open,
  onOpenChange,
  onMovimentacaoRegistrada,
  produtos,
}: MovimentarEstoqueDialogProps) {
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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Enviando dados de movimentação:", {
        ...formData,
        quantidade: Number.parseInt(formData.quantidade, 10),
      })

      const res = await fetch("/api/estoque/movimentacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantidade: Number.parseInt(formData.quantidade, 10),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Erro na resposta:", data)
        throw new Error(data.error || "Erro ao registrar movimentação")
      }

      console.log("Movimentação registrada com sucesso:", data)
      onMovimentacaoRegistrada()
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
  const mostrarOrigem = formData.tipo === "transferencia"
  const mostrarDestino = formData.tipo === "transferencia"

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 mb-5">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Movimentar Estoque</h3>
          <p className="text-sm text-muted-foreground">Registre uma movimentação de estoque.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)} required>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo de movimentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada no Estoque</SelectItem>
                <SelectItem value="saida">Saída do Estoque</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="produtoId">Produto</Label>
            <Select
              value={formData.produtoId}
              onValueChange={(value) => handleSelectChange("produtoId", value)}
              required
            >
              <SelectTrigger id="produtoId">
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

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              name="quantidade"
              type="number"
              min="1"
              value={formData.quantidade}
              onChange={handleChange}
              required
            />
          </div>

          {mostrarOrigem && (
            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Select
                value={formData.origem}
                onValueChange={(value) => handleSelectChange("origem", value)}
                required={mostrarOrigem}
              >
                <SelectTrigger id="origem">
                  <SelectValue placeholder="Selecione a origem" />
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

          {mostrarDestino && (
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Select
                value={formData.destino}
                onValueChange={(value) => handleSelectChange("destino", value)}
                required={mostrarDestino}
              >
                <SelectTrigger id="destino">
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

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Observações sobre esta movimentação"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
