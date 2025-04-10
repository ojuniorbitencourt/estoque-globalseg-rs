import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EstoquePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/estoque/minimo">
            <Button variant="outline">Configurar Estoque Mínimo</Button>
          </Link>
          {/* Outros botões existentes */}
        </div>
      </div>

      {/* Conteúdo existente da página */}
    </div>
  )
}
