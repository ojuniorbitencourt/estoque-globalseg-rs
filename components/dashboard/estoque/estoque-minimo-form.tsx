"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EstoqueMinimoProdutoFormProps {
  produto: {
    id: string
    estoqueMinimo: number
  }
}

export function EstoqueMinimoProdutoForm({ produto }: EstoqueMinimoProdutoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [estoqueMinimo, setEstoqueMinimo] = useState(produto.estoqueMinimo)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (estoqueMinimo < 0) {
      toast({
        title: "Valor inválido",
        description: "O estoque mínimo não pode ser negativo.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/produtos/estoque-minimo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produtoId: produto.id,
          estoqueMinimo,
        }),
      })

      if (!response.ok) throw new Error("Falha ao atualizar estoque mínimo")

      toast({
        title: "Estoque mínimo atualizado",
        description: "O valor de estoque mínimo foi atualizado com sucesso.",
      })
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o estoque mínimo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Input
          type="number"
          value={estoqueMinimo}
          onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
          className="w-20 text-center"
          min={0}
        />
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button variant="ghost" className="h-8 px-2 text-center" onClick={() => setIsEditing(true)}>
      {estoqueMinimo}
    </Button>
  )
}
