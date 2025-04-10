import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { TabNavigation } from "@/components/dashboard/tab-navigation"
import { Plus } from "lucide-react"

export default function EstoquePage() {
  // Simulando dados de produtos
  const produtos = []

  const tabs = [
    { id: "geral", label: "Estoque Geral" },
    { id: "baixo", label: "Estoque Baixo" },
    { id: "tecnicos", label: "Estoque por Técnico" },
  ]

  return (
    <div>
      <PageHeader
        title="Estoque"
        subtitle="Gerencie o estoque de produtos e equipamentos"
        actions={
          <>
            <Link href="/dashboard/estoque/minimo">
              <button className="px-4 py-2 border rounded-md text-sm font-medium bg-white">Configurar Mínimos</button>
            </Link>
            <Link href="/dashboard/estoque/movimentar">
              <button className="px-4 py-2 border rounded-md text-sm font-medium bg-white">Movimentar Estoque</button>
            </Link>
            <Link href="/dashboard/estoque/adicionar">
              <button className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </button>
            </Link>
          </>
        }
      />

      <TabNavigation tabs={tabs} className="mb-6" />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium">Produtos em Estoque</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
            />
            <span className="absolute left-2.5 top-2.5">🔍</span>
          </div>
        </div>
        <div className="p-6">
          {produtos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium mb-2">Nenhum produto encontrado</p>
              <p className="text-sm">Adicione produtos ao estoque para visualizá-los aqui.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3 text-center">Quantidade</th>
                  <th className="px-6 py-3 text-center">Estoque Mínimo</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produtos.map((produto) => (
                  <tr key={produto.id}>{/* Conteúdo da tabela */}</tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
