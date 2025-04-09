import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const produtoUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  codigo: z.string().min(3).optional(),
  categoria: z.string().optional(),
  preco: z.number().positive().optional(),
  status: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se o ID é válido
    if (!params.id) {
      return NextResponse.json({ error: "ID do produto não fornecido" }, { status: 400 })
    }

    console.log("Buscando produto com ID:", params.id)

    // Buscar o produto
    const produto = await prisma.produto.findUnique({
      where: { id: params.id },
    })

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    console.log("Produto encontrado:", produto)

    // Buscar informações adicionais
    const [estoquesTecnicos, movimentacoes] = await Promise.all([
      prisma.estoqueTecnico.findMany({
        where: { produtoId: params.id },
        include: {
          tecnico: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.movimentacaoEstoque.findMany({
        where: { produtoId: params.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ])

    console.log("Estoques técnicos:", estoquesTecnicos)
    console.log("Movimentações:", movimentacoes)

    // Retornar produto com informações adicionais
    const result = {
      ...produto,
      estoquesTecnicos,
      movimentacoes,
    }

    console.log("Resultado final:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar detalhes do produto:", error)
    return NextResponse.json({ error: "Erro ao buscar detalhes do produto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validar dados
    const validation = produtoUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 })
    }

    // Verificar se produto existe
    const existingProduto = await prisma.produto.findUnique({
      where: { id: params.id },
    })

    if (!existingProduto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Verificar se código já existe (se estiver sendo atualizado)
    if (body.codigo && body.codigo !== existingProduto.codigo) {
      const codigoExists = await prisma.produto.findUnique({
        where: { codigo: body.codigo },
      })

      if (codigoExists) {
        return NextResponse.json({ error: "Código já cadastrado" }, { status: 400 })
      }
    }

    // Atualizar produto
    const produto = await prisma.produto.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(produto)
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se produto existe
    const existingProduto = await prisma.produto.findUnique({
      where: { id: params.id },
    })

    if (!existingProduto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Verificar se produto está em uso
    const [estoquesTecnicos, itensAtendimento] = await Promise.all([
      prisma.estoqueTecnico.findMany({
        where: { produtoId: params.id },
      }),
      prisma.itemAtendimento.findMany({
        where: { produtoId: params.id },
      }),
    ])

    if (estoquesTecnicos.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir um produto que está no estoque de técnicos" },
        { status: 400 },
      )
    }

    if (itensAtendimento.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir um produto que foi utilizado em atendimentos" },
        { status: 400 },
      )
    }

    // Excluir movimentações e produto
    await prisma.$transaction([
      prisma.movimentacaoEstoque.deleteMany({
        where: { produtoId: params.id },
      }),
      prisma.produto.delete({
        where: { id: params.id },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
