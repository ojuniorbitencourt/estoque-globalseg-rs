import { PageHeader } from "@/components/dashboard/page-header"
import { MetricCard } from "@/components/dashboard/metric-card"
import { TabNavigation } from "@/components/dashboard/tab-navigation"
import { BarChart3, ShoppingCart, CreditCard, PercentCircle } from "lucide-react"

export default function RelatoriosPage() {
  const tabs = [
    { id: "vendas", label: "Vendas" },
    { id: "clientes", label: "Clientes" },
    { id: "produtos", label: "Produtos" },
    { id: "financeiro", label: "Financeiro" },
  ]

  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Visualize os dados e métricas do seu negócio" />

      <TabNavigation tabs={tabs} defaultTab="vendas" className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Vendas Totais"
          value="R$ 0,00"
          icon={<BarChart3 className="h-5 w-5" />}
          change={{ value: "+15% em relação ao período anterior", positive: true }}
        />
        <MetricCard
          title="Ticket Médio"
          value="R$ 0,00"
          icon={<ShoppingCart className="h-5 w-5" />}
          change={{ value: "+5% em relação ao período anterior", positive: true }}
        />
        <MetricCard
          title="Taxa de Conversão"
          value="0%"
          icon={<PercentCircle className="h-5 w-5" />}
          change={{ value: "+2% em relação ao período anterior", positive: true }}
        />
        <MetricCard
          title="Vendas Canceladas"
          value="R$ 0,00"
          icon={<CreditCard className="h-5 w-5" />}
          change={{ value: "-3% em relação ao período anterior", positive: true }}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Desempenho de Vendas</h2>
            <p className="text-sm text-gray-500">Análise de vendas por período</p>
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
            <option>Mensal</option>
            <option>Semanal</option>
            <option>Diário</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <BarChart3 className="h-6 w-6 mr-2" />
          <span>Gráfico de desempenho de vendas por mensal</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium">Vendas por Produto</h2>
          <p className="text-sm text-gray-500">Top 5 produtos mais vendidos no período</p>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <span>Nenhum dado disponível</span>
        </div>
      </div>
    </div>
  )
}
