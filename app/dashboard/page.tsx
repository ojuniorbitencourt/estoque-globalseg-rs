import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Package, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ErrorBoundary } from "@/components/error-boundary"

async function getProdutosBaixoEstoque() {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        status: "Ativo",
        quantidadeEstoque: {
          lte: {
            path: ["estoqueMinimo"],
          },
        },
      },
      orderBy: {
        quantidadeEstoque: "asc",
      },
      take: 5,
    })
    return produtos
  } catch (error) {
    console.error("Erro ao buscar produtos com estoque baixo:", error)
    return []
  }
}

async function getEstoqueTecnicos() {
  try {
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
      take: 10,
    })

    // Agrupar por técnico
    const tecnicosMap = new Map()

    estoqueTecnicos.forEach((item) => {
      if (!tecnicosMap.has(item.tecnicoId)) {
        tecnicosMap.set(item.tecnicoId, {
          id: item.tecnicoId,
          nome: item.tecnico?.user?.name || "Técnico sem nome",
          produtos: [],
          totalItens: 0,
        })
      }

      const tecnico = tecnicosMap.get(item.tecnicoId)
      tecnico.produtos.push({
        id: item.produtoId,
        nome: item.produto?.nome || "Produto sem nome",
        quantidade: item.quantidade,
      })
      tecnico.totalItens += item.quantidade
    })

    return Array.from(tecnicosMap.values())
  } catch (error) {
    console.error("Erro ao buscar estoque por técnico:", error)
    return []
  }
}

export default async function DashboardPage() {
  let produtosBaixoEstoque = []
  let estoqueTecnicos = []
  let totalProdutos = 0
  let totalTecnicos = 0
  let totalClientes = 0
  let totalAtendimentos = 0
  let atendimentosEmAndamento = 0
  let atendimentosRecentes = []

  try {
    // Wrap each database query in try/catch to prevent page crashes
    try {
      produtosBaixoEstoque = await getProdutosBaixoEstoque()
    } catch (e) {
      console.error("Erro ao buscar produtos com estoque baixo:", e)
    }

    try {
      estoqueTecnicos = await getEstoqueTecnicos()
    } catch (e) {
      console.error("Erro ao buscar estoque por técnico:", e)
    }

    try {
      totalProdutos = await prisma.produto.count({
        where: { status: "Ativo" },
      })
    } catch (e) {
      console.error("Erro ao contar produtos:", e)
    }

    try {
      totalTecnicos = await prisma.tecnico.count({
        where: { status: "Ativo" },
      })
    } catch (e) {
      console.error("Erro ao contar técnicos:", e)
    }

    try {
      totalClientes = await prisma.cliente.count({
        where: { status: "Ativo" },
      })
    } catch (e) {
      console.error("Erro ao contar clientes:", e)
    }

    try {
      totalAtendimentos = await prisma.atendimento.count()
    } catch (e) {
      console.error("Erro ao contar atendimentos:", e)
    }

    try {
      atendimentosEmAndamento = await prisma.atendimento.count({
        where: { status: "Em Andamento" },
      })
    } catch (e) {
      console.error("Erro ao contar atendimentos em andamento:", e)
    }

    try {
      atendimentosRecentes = await prisma.atendimento.findMany({
        take: 2,
        orderBy: { dataAtendimento: "desc" },
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
        },
      })
    } catch (e) {
      console.error("Erro ao buscar atendimentos recentes:", e)
    }
  } catch (error) {
    console.error("Erro geral ao carregar dados do dashboard:", error)
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProdutos}</div>
              <p className="text-xs text-muted-foreground">
                {produtosBaixoEstoque.length > 0 ? (
                  <span className="flex items-center text-destructive">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {produtosBaixoEstoque.length} com estoque baixo
                  </span>
                ) : (
                  "Estoque saudável"
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Técnicos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTecnicos}</div>
              <p className="text-xs text-muted-foreground">Equipe técnica disponível</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClientes}</div>
              <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAtendimentos}</div>
              <p className="text-xs text-muted-foreground">{atendimentosEmAndamento} em andamento</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Produtos com Estoque Crítico</CardTitle>
                <CardDescription>Produtos que precisam de reposição imediata</CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/estoque/minimo">
                  <Button variant="outline" size="sm">
                    Configurar Mínimos
                  </Button>
                </Link>
                <Link href="/dashboard/estoque">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {produtosBaixoEstoque.length === 0 ? (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Tudo em ordem!</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Não há produtos com estoque crítico no momento.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {produtosBaixoEstoque.map((produto) => {
                    const percentual =
                      produto.estoqueMinimo > 0
                        ? Math.min(100, Math.round((produto.quantidadeEstoque / produto.estoqueMinimo) * 100))
                        : 0
                    return (
                      <div key={produto.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{produto.nome}</span>
                          <Badge variant={percentual < 30 ? "destructive" : "outline"}>
                            {produto.quantidadeEstoque} unidades
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentual} className="h-2" />
                          <span className="text-xs text-muted-foreground w-12">{percentual}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Estoque por Técnico</CardTitle>
              <CardDescription>Distribuição de produtos entre técnicos</CardDescription>
            </CardHeader>
            <CardContent>
              {estoqueTecnicos.length === 0 ? (
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Sem dados</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Não há informações de estoque por técnico disponíveis.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {estoqueTecnicos.map((tecnico) => (
                    <div key={tecnico.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{tecnico.nome}</span>
                        <Badge variant="secondary">{tecnico.totalItens} itens</Badge>
                      </div>
                      <div className="space-y-1 pl-4">
                        {tecnico.produtos.slice(0, 3).map((produto) => (
                          <div key={produto.id} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{produto.nome}</span>
                            <span>{produto.quantidade} un.</span>
                          </div>
                        ))}
                        {tecnico.produtos.length > 3 && (
                          <Link
                            href={`/dashboard/tecnicos/${tecnico.id}/estoque`}
                            className="text-xs text-primary hover:underline"
                          >
                            + {tecnico.produtos.length - 3} outros produtos
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos Recentes</CardTitle>
              <CardDescription>Últimos atendimentos registrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-3 gap-4 p-4 text-sm font-medium">
                  <div>Cliente</div>
                  <div>Técnico</div>
                  <div>Data</div>
                </div>
                <div className="divide-y divide-border rounded-md border">
                  {atendimentosRecentes.map((atendimento) => (
                    <div key={atendimento.id} className="grid grid-cols-3 gap-4 p-4 text-sm">
                      <div>{atendimento.cliente?.nome || "N/A"}</div>
                      <div>{atendimento.tecnico?.user?.name || "N/A"}</div>
                      <div>{new Date(atendimento.dataAtendimento).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {atendimentosRecentes.length === 0 && (
                    <div className="p-4 text-sm text-center text-muted-foreground">Nenhum atendimento registrado.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}
