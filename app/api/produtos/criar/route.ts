import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const categoriasValidas = ["PGDM", "ATM", "Cortinas Eletrônicas", "Loja Ferragens"]

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Dados recebidos na API alternativa:", data)

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

    // Executar SQL direto para evitar problemas com campos obrigatórios
    const produto = await prisma.$executeRaw`
      INSERT INTO produtos (
        id, 
        codigo, 
        nome, 
        categoria, 
        descricao, 
        quantidade_estoque, 
        estoque_minimo, 
        status, 
        created_at, 
        updated_at
      ) VALUES (
        gen_random_uuid(), 
        ${data.codigo}, 
        ${data.nome}, 
        ${data.categoria}, 
        ${data.descricao || null}, 
        ${Number(data.quantidadeEstoque) || 0}, 
        ${Number(data.estoqueMinimo) || 5}, 
        'Ativo', 
        NOW(), 
        NOW()
      )
    `

    return NextResponse.json({ success: true, message: "Produto criado com sucesso" }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto (API alternativa):", error)
    return NextResponse.json(
      {
        error: "Erro ao criar produto",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
