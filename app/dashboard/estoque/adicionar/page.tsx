"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Categorias específicas conforme solicitado
const categorias = ["PGDM", "ATM", "Cortinas Eletrônicas", "Loja Ferragens"]

export default function AdicionarProdutoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCodigo, setIsLoadingCodigo] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    descricao: "",
    quantidadeEstoque: 0,
    estoqueMinimo: 5,
  })
  const [schemaInfo, setSchemaInfo] = useState(null)

  // Buscar informações do esquema do banco de dados
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch("/api/debug/schema")
        if (response.ok) {
          const data = await response.json()
          console.log("Informações do esquema:", data)
          setSchemaInfo(data)
        }
      } catch (error) {
        console.error("Erro ao buscar esquema:", error)
      }
    }

    fetchSchema()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantidadeEstoque" || name === "estoqueMinimo" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = async (name: string, value: string) => {
    console.log(`Selecionando ${name}: ${value}`)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Se a categoria foi alterada, gerar um novo código
    if (name === "categoria" && value) {
      await gerarProximoCodigo(value)
    }
  }

  const gerarProximoCodigo = async (categoria: string) => {
    setIsLoadingCodigo(true)
    try {
      console.log(`Gerando código para categoria: ${categoria}`)
      const response = await fetch(`/api/produtos/proximo-codigo?categoria=${encodeURIComponent(categoria)}`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erro na resposta:", errorData)
        throw new Error("Erro ao gerar código")
      }

      const data = await response.json()
      console.log("Código gerado:", data)

      setFormData((prev) => ({
        ...prev,
        codigo: data.codigo,
      }))
    } catch (error) {
      console.error("Erro ao gerar código:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar o código automaticamente",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCodigo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Enviando dados:", formData)

      // Garantir que descricao seja uma string ou null
      const dadosParaEnviar = {
        ...formData,
        descricao: formData.descricao || null,
        quantidadeEstoque: Number(formData.quantidadeEstoque),
        estoqueMinimo: Number(formData.estoqueMinimo),
      }

      console.log("Dados formatados para envio:", dadosParaEnviar)

      // 1. Tentar a API específica para a tabela 'produtos'
      console.log("Tentando API específica para tabela 'produtos'...")
      const produtosResponse = await fetch("/api/produtos/produtos-tabela", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      })

      console.log("Status da resposta produtos-tabela:", produtosResponse.status)
      const produtosData = await produtosResponse.json()
      console.log("Resposta da API produtos-tabela:", produtosData)

      if (produtosResponse.ok) {
        toast({
          title: "Produto adicionado",
          description: "O produto foi adicionado com sucesso ao estoque.",
        })

        // Redirecionar para a página de estoque
        router.push("/dashboard/estoque")
        router.refresh()
        return
      }

      // 2. Se a API específica falhar, tentar a API SQL corrigida
      console.log("Tentando API SQL corrigida...")
      const sqlCorrigidoResponse = await fetch("/api/produtos/sql-corrigido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      })

      console.log("Status da resposta SQL corrigida:", sqlCorrigidoResponse.status)
      const sqlCorrigidoData = await sqlCorrigidoResponse.json()
      console.log("Resposta da API SQL corrigida:", sqlCorrigidoData)

      if (sqlCorrigidoResponse.ok) {
        toast({
          title: "Produto adicionado",
          description: "O produto foi adicionado com sucesso ao estoque.",
        })

        // Redirecionar para a página de estoque
        router.push("/dashboard/estoque")
        router.refresh()
        return
      }

      // 3. Se todas as APIs falharem, mostrar erro com detalhes
      console.error("Todas as tentativas falharam")
      console.error("Detalhes do esquema:", schemaInfo)

      throw new Error(
        `Falha ao adicionar produto. Detalhes: ${JSON.stringify(produtosData)} / ${JSON.stringify(sqlCorrigidoData)}`,
      )
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar produto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/estoque">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Adicionar Produto</h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Novo Produto</CardTitle>
          <CardDescription>Adicione um novo produto ao sistema de estoque.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => handleSelectChange("categoria", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <div className="relative">
                  <Input
                    id="codigo"
                    name="codigo"
                    placeholder="Selecione uma categoria primeiro"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    disabled={isLoadingCodigo}
                  />
                  {isLoadingCodigo && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Código gerado automaticamente, mas pode ser editado se necessário
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Cabo Coaxial 4mm"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descrição detalhada do produto"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
              />
              {schemaInfo && schemaInfo.colunasCorreta && (
                <p className="text-xs text-muted-foreground">
                  {schemaInfo.colunasCorreta.some(
                    (col) =>
                      col.column_name === "descricao" ||
                      col.column_name === "descrição" ||
                      col.column_name === "descricao",
                  )
                    ? "Campo de descrição disponível no banco de dados."
                    : "Aviso: O campo de descrição pode não estar disponível no banco de dados."}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidadeEstoque">Quantidade Inicial</Label>
                <Input
                  id="quantidadeEstoque"
                  name="quantidadeEstoque"
                  type="number"
                  min="0"
                  value={formData.quantidadeEstoque}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                <Input
                  id="estoqueMinimo"
                  name="estoqueMinimo"
                  type="number"
                  min="0"
                  value={formData.estoqueMinimo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/estoque">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Produto
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
