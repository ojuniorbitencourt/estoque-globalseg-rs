import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const categoriasValidas = ["PGDM", "ATM", "Cortinas Eletrônicas", "Loja Ferragens"]

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Dados recebidos:", data)

    // Validar dados
    if (!data.codigo || !data.nome || !data.categoria) {
      return NextResponse.json({ error: "Código, nome e categoria são obrigatórios" }, { status: 400 })
    }

    // Verificar se a categoria é válida
    if (!categoriasValidas.includes(data.categoria)) {
      return NextResponse.json({ error: "Categoria inválida" }, { status: 400 })
    }

    // Verificar se já existe um produto com o mesmo código
    const produtoExistente = await prisma.produto.findUnique({
      where: { codigo: data.codigo },
    })

    if (produtoExistente) {
      return NextResponse.json({ error: "Já existe um produto com este código" }, { status: 400 })
    }

    // Criar o produto - garantindo que descricao seja uma string ou null
    const produto = await prisma.produto.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        categoria: data.categoria,
        descricao: data.descricao || null,
        quantidadeEstoque: Number(data.quantidadeEstoque) || 0,
        estoqueMinimo: Number(data.estoqueMinimo) || 5,
        preco: null, // Definindo explicitamente como null
        status: "Ativo",
      },
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar produto",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        status: "Ativo",
      },
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(produtos)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}
