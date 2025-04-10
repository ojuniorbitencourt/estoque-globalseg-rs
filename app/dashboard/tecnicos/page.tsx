import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionCard } from "@/components/dashboard/section-card"

export default function TecnicosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Técnicos</h1>
          <p className="text-sm text-gray-500">Gerencie a equipe técnica e seus estoques individuais</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Técnico
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Buscar técnicos..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <SectionCard title="Técnicos" description="Lista de técnicos ativos">
        <div className="rounded-lg border">
          <div className="grid grid-cols-4 border-b bg-gray-50 p-3 text-sm font-medium text-gray-500">
            <div>Nome</div>
            <div>Contato</div>
            <div>Produtos em estoque</div>
            <div className="text-right">Ações</div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-4 items-center py-2">
              <div className="font-medium">João Silva</div>
              <div className="text-sm text-gray-500">(11) 98765-4321</div>
              <div className="text-sm">5 produtos</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Ver Estoque
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
