import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  ArrowUpRight,
  Box,
  ClipboardList,
  Package,
  ShoppingCart,
  PenToolIcon as Tool,
  Users,
} from "lucide-react"
import Link from "next/link"

import { getEstoqueBaixo } from "@/lib/data/estoque"
import { getEstoqueTecnicos } from "@/lib/data/tecnicos"
import { getDashboardStats } from "@/lib/data/dashboard"

// Componente de carregamento para os cards
function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}

// Componente de carregamento para as tabelas
function TableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

// Componente para exibir estatísticas do dashboard
async function DashboardStats() {
  const stats = await getDashboardStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProdutos}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.produtosBaixoEstoque > 0 ? (
              <>
                <AlertCircle className="mr-1 h-3 w-3 text-destructive" />
                <span className="text-destructive font-medium">{stats.produtosBaixoEstoque} com estoque baixo</span>
              </>
            ) : (
              <span>Estoque saudável</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Técnicos Ativos</CardTitle>
          <Tool className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.tecnicosAtivos}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Equipe técnica disponível</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClientes}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Clientes cadastrados</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAtendimentos}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{stats.atendimentosEmAndamento} em andamento</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para exibir produtos com estoque baixo
async function EstoqueBaixo() {
  const produtos = await getEstoqueBaixo()

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Produtos com Estoque Crítico</CardTitle>
          <CardDescription>Produtos que precisam de reposição imediata</CardDescription>
        </div>
        <Link href="/dashboard/estoque">
          <Button variant="outline" size="sm" className="gap-1">
            <span>Ver todos</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {produtos.length === 0 ? (
          <Alert>
            <AlertTitle>Tudo em ordem!</AlertTitle>
            <AlertDescription>Não há produtos com estoque crítico no momento.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {produtos.map((produto) => {
              const percentual = Math.min(100, Math.round((produto.quantidadeEstoque / produto.estoqueMinimo) * 100))
              return (
                <div key={produto.id} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{produto.nome}</span>
                    </div>
                    <Badge variant={percentual < 30 ? "destructive" : "outline"} className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{produto.quantidadeEstoque} unidades</span>
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
      <CardFooter>
        <Link href="/dashboard/estoque/repor" className="w-full">
          <Button className="w-full gap-1">
            <ShoppingCart className="h-4 w-4" />
            <span>Repor Estoque</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Componente para exibir estoque por técnico
async function EstoqueTecnicos() {
  const estoqueTecnicos = await getEstoqueTecnicos()

  // Agrupar por técnico
  const tecnicosMap = new Map()

  estoqueTecnicos.forEach((item) => {
    if (!tecnicosMap.has(item.tecnicoId)) {
      tecnicosMap.set(item.tecnicoId, {
        id: item.tecnicoId,
        nome: item.tecnicoNome,
        produtos: [],
        totalItens: 0,
      })
    }

    const tecnico = tecnicosMap.get(item.tecnicoId)
    tecnico.produtos.push({
      id: item.produtoId,
      nome: item.produtoNome,
      quantidade: item.quantidade,
    })
    tecnico.totalItens += item.quantidade
  })

  const tecnicos = Array.from(tecnicosMap.values())

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Estoque por Técnico</CardTitle>
          <CardDescription>Distribuição de produtos entre técnicos</CardDescription>
        </div>
        <Link href="/dashboard/tecnicos">
          <Button variant="outline" size="sm" className="gap-1">
            <span>Ver todos</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {tecnicos.length === 0 ? (
          <Alert>
            <AlertTitle>Sem dados</AlertTitle>
            <AlertDescription>Não há informações de estoque por técnico disponíveis.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {tecnicos.map((tecnico) => (
              <div key={tecnico.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tool className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{tecnico.nome}</span>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <span>{tecnico.totalItens} itens</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2 pl-6">
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
      <CardFooter>
        <Link href="/dashboard/tecnicos/estoque/transferir" className="w-full">
          <Button variant="outline" className="w-full gap-1">
            <span>Transferir Estoque</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Substituir o componente ResumoFinanceiro por um dos componentes abaixo

// Opção 1: Resumo de Atendimentos por Status
async function ResumoAtendimentos() {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Status de Atendimentos</CardTitle>
        <CardDescription>Distribuição por status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Em Andamento</span>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              8
            </Badge>
          </div>
          <Progress value={25} className="h-2 bg-amber-100" indicatorClassName="bg-amber-500" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Agendados</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              12
            </Badge>
          </div>
          <Progress value={38} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Concluídos</span>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
              42
            </Badge>
          </div>
          <Progress value={75} className="h-2 bg-emerald-100" indicatorClassName="bg-emerald-500" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Cancelados</span>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-700">
              3
            </Badge>
          </div>
          <Progress value={10} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/atendimentos" className="w-full">
          <Button variant="outline" className="w-full gap-1">
            <span>Gerenciar Atendimentos</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Opção 2: Produtos Mais Utilizados
async function ProdutosMaisUtilizados() {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Produtos Mais Utilizados</CardTitle>
        <CardDescription>Top 5 produtos em atendimentos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Sensor de Movimento</div>
              <div className="flex items-center gap-2">
                <Progress value={85} className="h-2 w-32" />
                <span className="text-xs text-muted-foreground">85%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Câmera HD</div>
              <div className="flex items-center gap-2">
                <Progress value={72} className="h-2 w-32" />
                <span className="text-xs text-muted-foreground">72%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Cabo HDMI</div>
              <div className="flex items-center gap-2">
                <Progress value={65} className="h-2 w-32" />
                <span className="text-xs text-muted-foreground">65%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Controle Remoto</div>
              <div className="flex items-center gap-2">
                <Progress value={48} className="h-2 w-32" />
                <span className="text-xs text-muted-foreground">48%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Fonte de Alimentação</div>
              <div className="flex items-center gap-2">
                <Progress value={35} className="h-2 w-32" />
                <span className="text-xs text-muted-foreground">35%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/produtos/estatisticas" className="w-full">
          <Button variant="outline" className="w-full gap-1">
            <span>Ver Estatísticas</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Opção 3: Atividades Recentes
async function AtividadesRecentes() {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas ações no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium">Novo cliente cadastrado</p>
              <p className="text-xs text-muted-foreground">Condomínio Residencial Flores</p>
              <p className="text-xs text-muted-foreground">Há 35 minutos</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <ClipboardList className="h-4 w-4 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-medium">Atendimento concluído</p>
              <p className="text-xs text-muted-foreground">Técnico: Leonardo Brecher</p>
              <p className="text-xs text-muted-foreground">Há 1 hora</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <Package className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium">Estoque atualizado</p>
              <p className="text-xs text-muted-foreground">Sensor de Movimento: +15 unidades</p>
              <p className="text-xs text-muted-foreground">Há 3 horas</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Tool className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium">Técnico adicionado</p>
              <p className="text-xs text-muted-foreground">Carlos Oliveira</p>
              <p className="text-xs text-muted-foreground">Há 5 horas</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/atividades" className="w-full">
          <Button variant="outline" className="w-full gap-1">
            <span>Ver Todas Atividades</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Opção 4: Mapa de Atendimentos
async function MapaAtendimentos() {
  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Distribuição Geográfica</CardTitle>
        <CardDescription>Atendimentos por região</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-md">
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">Mapa de atendimentos</p>
              <p className="text-xs text-muted-foreground mt-1">Clique para visualizar em tela cheia</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="flex flex-col items-center justify-center rounded-md border p-2">
            <span className="text-xs text-muted-foreground">Zona Norte</span>
            <span className="text-lg font-bold">12</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md border p-2">
            <span className="text-xs text-muted-foreground">Zona Sul</span>
            <span className="text-lg font-bold">18</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md border p-2">
            <span className="text-xs text-muted-foreground">Zona Leste</span>
            <span className="text-lg font-bold">8</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md border p-2">
            <span className="text-xs text-muted-foreground">Zona Oeste</span>
            <span className="text-lg font-bold">15</span>
          </div>
        </div>
        <Link href="/dashboard/mapa" className="w-full mt-2">
          <Button variant="outline" className="w-full gap-1">
            <span>Ver Mapa Completo</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Componente para exibir atendimentos recentes
async function AtendimentosRecentes() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Atendimentos Recentes</CardTitle>
          <CardDescription>Últimos atendimentos registrados</CardDescription>
        </div>
        <Link href="/dashboard/atendimentos">
          <Button variant="outline" size="sm" className="gap-1">
            <span>Ver todos</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium">
            <div>Data</div>
            <div>Técnico</div>
            <div>Local</div>
            <div>Status</div>
            <div className="text-right">Ações</div>
          </div>
          <div className="divide-y divide-border rounded-md border">
            <div className="grid grid-cols-5 gap-4 p-4 text-sm">
              <div>08/04/2023</div>
              <div>Leonardo Brecher</div>
              <div>N/A</div>
              <div>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Concluído
                </Badge>
              </div>
              <div className="text-right">
                <Button variant="ghost" size="sm">
                  Detalhes
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4 text-sm">
              <div>08/04/2023</div>
              <div>Leonardo Brecher</div>
              <div>N/A</div>
              <div>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Concluído
                </Badge>
              </div>
              <div className="text-right">
                <Button variant="ghost" size="sm">
                  Detalhes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <div className="flex items-center justify-between md:col-span-2 lg:col-span-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do sistema</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            }
          >
            <DashboardStats />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Suspense
              fallback={
                <div className="col-span-1 lg:col-span-2">
                  <CardSkeleton />
                </div>
              }
            >
              <EstoqueBaixo />
            </Suspense>

            <Suspense
              fallback={
                <div className="col-span-1 lg:col-span-1">
                  <CardSkeleton />
                </div>
              }
            >
              <ResumoAtendimentos />
            </Suspense>

            <Suspense
              fallback={
                <div className="col-span-1 lg:col-span-1">
                  <CardSkeleton />
                </div>
              }
            >
              <EstoqueTecnicos />
            </Suspense>
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <Suspense
              fallback={
                <div className="col-span-1 lg:col-span-3">
                  <CardSkeleton />
                </div>
              }
            >
              <AtendimentosRecentes />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="estoque" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Suspense
              fallback={
                <div className="col-span-1 lg:col-span-2">
                  <CardSkeleton />
                </div>
              }
            >
              <EstoqueBaixo />
            </Suspense>

            <Suspense
              fallback={
                <div className="col-span-1 lg:col-span-1">
                  <CardSkeleton />
                </div>
              }
            >
              <EstoqueTecnicos />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="atendimentos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <Suspense
              fallback={
                <div className="col-span-1 lg:col-span-3">
                  <CardSkeleton />
                </div>
              }
            >
              <AtendimentosRecentes />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
