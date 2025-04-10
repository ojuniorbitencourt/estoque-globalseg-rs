"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function LimparEstoqueButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLimparEstoque = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/limpar-estoque", {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao limpar estoque")
      }

      toast({
        title: "Estoque limpo",
        description: "Todos os dados de estoque foram removidos com sucesso.",
      })

      // Recarregar a página
      router.refresh()
    } catch (error) {
      console.error("Erro ao limpar estoque:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao limpar estoque",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  // Só mostrar em ambiente de desenvolvimento
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4 mr-2" />
        Limpar Estoque
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar todos os dados de estoque?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente todos os produtos, movimentações e registros de estoque de técnicos.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleLimparEstoque()
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Limpando..." : "Sim, limpar tudo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
