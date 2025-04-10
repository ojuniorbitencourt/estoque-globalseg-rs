import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("API Prisma Corrigido - Dados recebidos:", data)

    // Validar dados
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

    // Criar dados base sem o campo descricao
    const dadosBase = {
      codigo: data.codigo,
      nome: data.nome,
      categoria: data.categoria,
      quantidadeEstoque: Number(data.quantidadeEstoque) || 0,
      estoqueMinimo: Number(data.estoqueMinimo) || 5,
      status: "Ativo",
    }

    // Tentar criar o produto sem o campo descricao
    console.log("Tentando criar produto sem o campo descricao")
    const produto = await prisma.produto.create({
      data: dadosBase,
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error("API Prisma Corrigido - Erro:", error)

    // Se o erro for relacionado a um campo desconhecido, tentar novamente com outro formato
    if (error instanceof Error && error.message.includes("Unknown arg")) {
      console.log("Erro de campo desconhecido, tentando outro formato")

      try {
        const data = await request.json()

        // Tentar criar com outro formato de dados
        const produto = await prisma.produto.create({
          data: {
            codigo: data.codigo,
            nome: data.nome,
            categoria: data.categoria,
            // Remover campos que podem causar problemas
            quantidadeEstoque: Number(data.quantidadeEstoque) || 0,
            estoqueMinimo: Number(data.estoqueMinimo) || 5,
            status: "Ativo",
          },
        })

        return NextResponse.json(produto, { status: 201 })
      } catch (secondError) {
        console.error("Segunda tentativa falhou:", secondError)
        return NextResponse.json(
          {
            error: "Erro ao criar produto (segunda tentativa)",
            details: secondError instanceof Error ? secondError.message : String(secondError),
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Erro ao criar produto",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
