"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MovimentarEstoqueDialog } from "@/components/dashboard/estoque/movimentar-estoque-dialog"

export function MovimentarEstoqueButton({ produtos }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Movimentar Estoque
      </Button>
      <MovimentarEstoqueDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onMovimentacaoRegistrada={() => {
          // Recarregar a página para atualizar os dados
          window.location.reload()
        }}
        produtos={produtos}
      />
    </>
  )
}
