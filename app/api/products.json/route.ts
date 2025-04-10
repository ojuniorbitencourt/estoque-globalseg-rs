import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 100

    const produtos = await prisma.produto.findMany({
      where: {
        status: "Ativo",
      },
      orderBy: {
        nome: "asc",
      },
      take: limit,
    })

    // Formatar os dados para o formato esperado
    const formattedProducts = produtos.map((produto) => ({
      id: produto.id,
      code: produto.codigo,
      name: produto.nome,
      quantity: produto.quantidadeEstoque,
      min_quantity: produto.estoqueMinimo,
      category: produto.categoria,
      status: produto.status,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}
