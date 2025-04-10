import { Users, Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionCard } from "@/components/dashboard/section-card"
import { EmptyState } from "@/components/dashboard/empty-state"

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-gray-500">Gerencie os clientes e seus atendimentos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Buscar clientes..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <SectionCard title="Clientes" description="Lista de clientes cadastrados">
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado"
          description="Adicione clientes para visualizá-los aqui."
          action={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Cliente
            </Button>
          }
        />
      </SectionCard>
    </div>
  )
}
