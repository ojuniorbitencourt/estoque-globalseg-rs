import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Dados recebidos na API simples:", data)

    // Validações básicas
    if (!data.codigo || !data.nome || !data.categoria) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se já existe um produto com o mesmo código
    const produtoExistente = await prisma.produto.findUnique({
      where: { codigo: data.codigo },
    })

    if (produtoExistente) {
      return NextResponse.json({ error: "Código já existe" }, { status: 400 })
    }

    // Criar o produto com apenas os campos essenciais
    const produto = await prisma.produto.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        categoria: data.categoria,
        descricao: data.descricao || null,
        quantidadeEstoque: Number(data.quantidadeEstoque) || 0,
        estoqueMinimo: Number(data.estoqueMinimo) || 5,
        status: "Ativo",
      },
      select: {
        id: true,
        codigo: true,
        nome: true,
      },
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error("Erro na API simples:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
