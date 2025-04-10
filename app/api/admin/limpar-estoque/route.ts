import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    // Verificar se estamos em ambiente de produção
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Esta operação não é permitida em ambiente de produção" }, { status: 403 })
    }

    // Primeiro, remover registros de estoque de técnicos
    await prisma.estoqueTecnico.deleteMany({})

    // Remover movimentações de estoque (se existir no seu schema)
    try {
      await prisma.movimentacaoEstoque.deleteMany({})
    } catch (e) {
      console.log("Tabela de movimentações não encontrada ou erro ao limpar")
    }

    // Remover produtos
    await prisma.produto.deleteMany({})

    return NextResponse.json({ success: true, message: "Dados de estoque limpos com sucesso" })
  } catch (error) {
    console.error("Erro ao limpar dados de estoque:", error)
    return NextResponse.json(
      { error: "Erro ao limpar dados de estoque", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
