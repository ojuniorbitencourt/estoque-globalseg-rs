import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request) {
  try {
    const { produtoId, estoqueMinimo } = await request.json()

    if (!produtoId) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    if (estoqueMinimo < 0) {
      return NextResponse.json({ error: "Estoque mínimo não pode ser negativo" }, { status: 400 })
    }

    const produto = await prisma.produto.update({
      where: { id: produtoId },
      data: { estoqueMinimo },
    })

    return NextResponse.json(produto)
  } catch (error) {
    console.error("Erro ao atualizar estoque mínimo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: { status: "Ativo" },
      select: {
        id: true,
        nome: true,
        codigo: true,
        categoria: true,
        quantidadeEstoque: true,
        estoqueMinimo: true,
      },
      orderBy: { nome: "asc" },
    })

    return NextResponse.json(produtos)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
