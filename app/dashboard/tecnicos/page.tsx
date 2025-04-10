import Link from "next/link"
import { PageHeader } from "@/components/dashboard/page-header"
import { Plus } from "lucide-react"

export default function TecnicosPage() {
  // Simulando dados de técnicos
  const tecnicos = []

  return (
    <div>
      <PageHeader
        title="Técnicos"
        subtitle="Gerencie sua equipe técnica e atribuições"
        actions={
          <Link href="/dashboard/tecnicos/novo">
            <button className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Técnico
            </button>
          </Link>
        }
      />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium">Lista de todos os técnicos cadastrados no sistema</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar técnicos..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
            />
            <span className="absolute left-2.5 top-2.5">🔍</span>
          </div>
        </div>
        <div className="p-6">
          {tecnicos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium mb-2">Nenhum técnico encontrado</p>
              <p className="text-sm">Adicione técnicos para visualizá-los aqui.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Cargo</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Itens em Estoque</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tecnicos.map((tecnico) => (
                  <tr key={tecnico.id}>{/* Conteúdo da tabela */}</tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
