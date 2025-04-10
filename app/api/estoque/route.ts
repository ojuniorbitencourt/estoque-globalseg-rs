import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar todos os produtos com estoque
    const produtos = await prisma.produto.findMany({
      where: { status: "Ativo" },
      orderBy: { nome: "asc" },
    })

    return NextResponse.json(produtos)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
