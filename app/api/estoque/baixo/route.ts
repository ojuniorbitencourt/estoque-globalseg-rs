import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Definir o limite mínimo de estoque (poderia vir de configurações)
const ESTOQUE_MINIMO_PADRAO = 5

export async function GET() {
  try {
    // Buscar produtos com estoque abaixo do mínimo
    const produtosBaixoEstoque = await prisma.produto.findMany({
      where: {
        status: "Ativo",
        quantidadeEstoque: {
          lte: ESTOQUE_MINIMO_PADRAO,
        },
      },
      orderBy: {
        quantidadeEstoque: "asc",
      },
    })

    // Adicionar o estoque mínimo para cada produto
    const produtosFormatados = produtosBaixoEstoque.map((produto) => ({
      ...produto,
      estoqueMinimo: ESTOQUE_MINIMO_PADRAO,
    }))

    return NextResponse.json(produtosFormatados)
  } catch (error) {
    console.error("Erro ao buscar produtos com estoque baixo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
