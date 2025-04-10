import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { Plus } from "lucide-react"

export default function ClientesPage() {
  // Simulando dados de clientes
  const clientes = []

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Gerencie seus clientes e suas informações"
        actions={
          <Link href="/dashboard/clientes/novo">
            <button className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Cliente
            </button>
          </Link>
        }
      />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium">Lista de todos os clientes cadastrados no sistema</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
            />
            <span className="absolute left-2.5 top-2.5">🔍</span>
          </div>
        </div>
        <div className="p-6">
          {clientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium mb-2">Nenhum cliente encontrado</p>
              <p className="text-sm">Adicione clientes para visualizá-los aqui.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Documento</th>
                  <th className="px-6 py-3">Telefone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>{/* Conteúdo da tabela */}</tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
