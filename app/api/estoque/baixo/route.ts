import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar produtos com estoque abaixo do mínimo específico de cada produto
    const produtosBaixoEstoque = await prisma.produto.findMany({
      where: {
        status: "Ativo",
        quantidadeEstoque: {
          lte: {
            path: ["estoqueMinimo"],
          },
        },
      },
      orderBy: {
        quantidadeEstoque: "asc",
      },
    })

    return NextResponse.json(produtosBaixoEstoque)
  } catch (error) {
    console.error("Erro ao buscar produtos com estoque baixo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
