"use client"

import { useState } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Plus } from "lucide-react"

export default function AtendimentosPage() {
  const [busca, setBusca] = useState("")
  // Simulando dados de atendimentos
  const atendimentos = []

  return (
    <div>
      <PageHeader
        title="Atendimentos"
        subtitle="Gerencie os atendimentos técnicos realizados"
        actions={
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Atendimento
          </button>
        }
      />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium">Lista de todos os atendimentos registrados</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar atendimentos..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <span className="absolute left-2.5 top-2.5">🔍</span>
          </div>
        </div>
        <div className="p-6">
          {atendimentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium mb-2">Nenhum atendimento encontrado</p>
              <p className="text-sm">Registre atendimentos para visualizá-los aqui.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Técnico</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Local</th>
                  <th className="px-6 py-3">Descrição</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {atendimentos.map((atendimento) => (
                  <tr key={atendimento.id}>{/* Conteúdo da tabela */}</tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
