"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProdutosRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/estoque")
  }, [router])

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex items-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
        <span className="ml-2">Redirecionando para Estoque...</span>
      </div>
    </div>
  )
}
