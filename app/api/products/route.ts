import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        status: "Ativo",
      },
      orderBy: {
        nome: "asc",
      },
      take: 100,
    })

    // Format the data for the frontend
    const formattedProducts = produtos.map((produto) => ({
      id: produto.id,
      code: produto.codigo,
      name: produto.nome,
      quantity: produto.quantidadeEstoque,
      min_quantity: produto.estoqueMinimo,
      category: produto.categoria || "Sem categoria",
      status: produto.status,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([])
  }
}
