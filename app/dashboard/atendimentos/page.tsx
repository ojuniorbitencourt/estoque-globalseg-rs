import { ClipboardList, Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionCard } from "@/components/dashboard/section-card"
import { EmptyState } from "@/components/dashboard/empty-state"

export default function AtendimentosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Atendimentos</h1>
          <p className="text-sm text-gray-500">Gerencie os atendimentos e produtos utilizados</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Atendimento
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Buscar atendimentos..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <SectionCard title="Atendimentos" description="Lista de atendimentos realizados">
        <EmptyState
          icon={ClipboardList}
          title="Nenhum atendimento encontrado"
          description="Registre atendimentos para visualizá-los aqui."
          action={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Atendimento
            </Button>
          }
        />
      </SectionCard>
    </div>
  )
}
