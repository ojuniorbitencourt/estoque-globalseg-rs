import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Package, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { MovimentarEstoqueButton } from "@/components/dashboard/estoque/movimentar-estoque-button"
import { LimparEstoqueButton } from "@/components/dashboard/estoque/limpar-estoque-button"

export default async function EstoquePage() {
  // Buscar produtos do banco de dados
  const produtos = await prisma.produto.findMany({
    where: { status: "Ativo" },
    orderBy: { nome: "asc" },
  })

  // Buscar produtos com estoque baixo
  const produtosBaixoEstoque = produtos
    .filter((produto) => produto.quantidadeEstoque <= produto.estoqueMinimo)
    .sort((a, b) => a.quantidadeEstoque - b.quantidadeEstoque)

  // Buscar estoque por técnico
  const estoqueTecnicos = await prisma.estoqueTecnico.findMany({
    include: {
      tecnico: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      produto: {
        select: {
          nome: true,
          codigo: true,
        },
      },
    },
    orderBy: [
      {
        tecnico: {
          user: {
            name: "asc",
          },
        },
      },
      {
        produto: {
          nome: "asc",
        },
      },
    ],
  })

  // Agrupar estoque por técnico
  const tecnicosMap = new Map()

  estoqueTecnicos.forEach((item) => {
    if (!tecnicosMap.has(item.tecnicoId)) {
      tecnicosMap.set(item.tecnicoId, {
        id: item.tecnicoId,
        nome: item.tecnico.user.name,
        produtos: [],
      })
    }

    const tecnico = tecnicosMap.get(item.tecnicoId)
    tecnico.produtos.push({
      id: item.produtoId,
      nome: item.produto.nome,
      codigo: item.produto.codigo,
      quantidade: item.quantidade,
    })
  })

  const tecnicosEstoque = Array.from(tecnicosMap.values())

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/estoque/minimo">
            <Button variant="outline">Configurar Estoque Mínimo</Button>
          </Link>
          <Link href="/dashboard/estoque/adicionar">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </Link>
          <MovimentarEstoqueButton produtos={produtos} />
          {/* Botão de limpar estoque (apenas em desenvolvimento) */}
          <LimparEstoqueButton />
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Estoque Geral</TabsTrigger>
          <TabsTrigger value="baixo">Estoque Baixo</TabsTrigger>
          <TabsTrigger value="tecnicos">Estoque por Técnico</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Produtos em Estoque</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-center">Estoque Mínimo</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Nenhum produto encontrado. Adicione produtos ao estoque.
                        </TableCell>
                      </TableRow>
                    ) : (
                      produtos.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">{produto.codigo}</TableCell>
                          <TableCell>{produto.nome}</TableCell>
                          <TableCell>{produto.categoria}</TableCell>
                          <TableCell className="text-center">{produto.quantidadeEstoque}</TableCell>
                          <TableCell className="text-center">{produto.estoqueMinimo}</TableCell>
                          <TableCell className="text-center">
                            {produto.quantidadeEstoque <= produto.estoqueMinimo ? (
                              <Badge
                                variant="destructive"
                                className="flex items-center justify-center gap-1 w-fit mx-auto"
                              >
                                <AlertCircle className="h-3 w-3" />
                                Baixo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="w-fit mx-auto">
                                Normal
                              </Badge>
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="baixo" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Produtos com Estoque Baixo</CardTitle>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-center">Estoque Mínimo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosBaixoEstoque.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Não há produtos com estoque baixo.
                        </TableCell>
                      </TableRow>
                    ) : (
                      produtosBaixoEstoque.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">{produto.codigo}</TableCell>
                          <TableCell>{produto.nome}</TableCell>
                          <TableCell>{produto.categoria}</TableCell>
                          <TableCell className="text-center">{produto.quantidadeEstoque}</TableCell>
                          <TableCell className="text-center">{produto.estoqueMinimo}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/estoque/produtos/${produto.id}`}>
                              <Button variant="ghost" size="sm">
                                Detalhes
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnicos" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Estoque por Técnico</CardTitle>
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {tecnicosEstoque.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Nenhum técnico com estoque encontrado.</div>
              ) : (
                <div className="space-y-6">
                  {tecnicosEstoque.map((tecnico) => (
                    <div key={tecnico.id} className="rounded-md border p-4">
                      <h3 className="text-lg font-medium mb-2">{tecnico.nome}</h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Código</TableHead>
                              <TableHead>Produto</TableHead>
                              <TableHead className="text-center">Quantidade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tecnico.produtos.map((produto) => (
                              <TableRow key={produto.id}>
                                <TableCell className="font-medium">{produto.codigo}</TableCell>
                                <TableCell>{produto.nome}</TableCell>
                                <TableCell className="text-center">{produto.quantidade}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
