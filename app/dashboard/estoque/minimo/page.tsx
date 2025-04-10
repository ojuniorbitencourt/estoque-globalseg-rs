"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Produto {
  id: string
  nome: string
  codigo: string
  categoria: string
  quantidadeEstoque: number
  estoqueMinimo: number
}

export default function EstoqueMinimoPage() {
  const { toast } = useToast()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("/api/produtos/estoque-minimo")
        if (!response.ok) throw new Error("Falha ao buscar produtos")
        const data = await response.json()
        setProdutos(data)
      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [toast])

  const handleEdit = (produto: Produto) => {
    setEditingId(produto.id)
    setEditValue(produto.estoqueMinimo)
  }

  const handleSave = async (produtoId: string) => {
    if (editValue < 0) {
      toast({
        title: "Valor inválido",
        description: "O estoque mínimo não pode ser negativo.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/produtos/estoque-minimo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produtoId,
          estoqueMinimo: editValue,
        }),
      })

      if (!response.ok) throw new Error("Falha ao atualizar estoque mínimo")

      const updatedProduto = await response.json()
      setProdutos(produtos.map((p) => (p.id === produtoId ? { ...p, estoqueMinimo: updatedProduto.estoqueMinimo } : p)))

      toast({
        title: "Sucesso",
        description: "Estoque mínimo atualizado com sucesso.",
      })

      setEditingId(null)
    } catch (error) {
      console.error("Erro ao atualizar estoque mínimo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o estoque mínimo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/estoque">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Configuração de Estoque Mínimo</h1>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Produtos</h2>
          <p className="text-sm text-muted-foreground">
            Defina o estoque mínimo para cada produto para receber alertas quando o estoque estiver baixo.
          </p>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Estoque Atual</TableHead>
                    <TableHead className="text-center">Estoque Mínimo</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.codigo}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell className="text-center">{produto.quantidadeEstoque}</TableCell>
                      <TableCell className="text-center">
                        {editingId === produto.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(Number(e.target.value))}
                              className="w-20 text-center"
                              min={0}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleSave(produto.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" className="h-8 px-2 text-center" onClick={() => handleEdit(produto)}>
                            {produto.estoqueMinimo}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {produto.quantidadeEstoque <= produto.estoqueMinimo ? (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Estoque Baixo
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Estoque OK
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/estoque/produtos/${produto.id}`}>
                          <Button variant="ghost" size="sm">
                            Detalhes
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {produtos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Nenhum produto encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
