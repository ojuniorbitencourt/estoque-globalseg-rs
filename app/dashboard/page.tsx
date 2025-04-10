import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Package, Users, ClipboardList, Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Bem-vindo ao painel de controle da Global Seg"
        actions={
          <>
            <button className="px-4 py-2 border rounded-md text-sm font-medium bg-white">Últimos 30 dias</button>
            <Link href="/dashboard/relatorios">
              <button className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Gerar Relatório
              </button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Produtos"
          value="2"
          icon={<Package className="h-5 w-5" />}
          change={{ value: "1 com estoque baixo", positive: false }}
        />
        <MetricCard
          title="Técnicos Ativos"
          value="1"
          icon={<Users className="h-5 w-5" />}
          change={{ value: "Equipe técnica disponível", positive: true }}
        />
        <MetricCard
          title="Clientes"
          value="0"
          icon={<Users className="h-5 w-5" />}
          change={{ value: "Clientes cadastrados", positive: true }}
        />
        <MetricCard
          title="Atendimentos"
          value="0"
          icon={<ClipboardList className="h-5 w-5" />}
          change={{ value: "Nenhum em andamento", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Produtos com Estoque Crítico</h2>
              <p className="text-sm text-gray-500">Produtos que precisam de reposição imediata</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/estoque/minimo">
                <button className="px-3 py-1 text-xs border rounded-md bg-white">Configurar Mínimos</button>
              </Link>
              <Link href="/dashboard/estoque">
                <button className="px-3 py-1 text-xs border rounded-md bg-white">Ver Todos</button>
              </Link>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium mb-2">Tudo em ordem!</p>
            <p className="text-sm">Não há produtos com estoque crítico no momento.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Estoque por Técnico</h2>
              <p className="text-sm text-gray-500">Distribuição de produtos entre técnicos</p>
            </div>
            <Link href="/dashboard/tecnicos">
              <button className="px-3 py-1 text-xs border rounded-md bg-white">Ver Todos</button>
            </Link>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium mb-2">Sem dados</p>
            <p className="text-sm">Não há informações de estoque por técnico disponíveis.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Atendimentos Recentes</h2>
            <p className="text-sm text-gray-500">Últimos atendimentos registrados no sistema</p>
          </div>
          <Link href="/dashboard/atendimentos">
            <button className="px-3 py-1 text-xs border rounded-md bg-white">Ver Todos</button>
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p className="font-medium mb-2">Nenhum atendimento encontrado</p>
          <p className="text-sm">Registre atendimentos para visualizá-los aqui.</p>
        </div>
      </div>
    </div>
  )
}
