import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("API Produtos Tabela - Dados recebidos:", data)

    // Validações básicas
    if (!data.codigo || !data.nome || !data.categoria) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se já existe um produto com o mesmo código
    const produtoExistente = await prisma.$queryRaw`
      SELECT id FROM produtos WHERE codigo = ${data.codigo} LIMIT 1
    `

    if (Array.isArray(produtoExistente) && produtoExistente.length > 0) {
      return NextResponse.json({ error: "Código já existe" }, { status: 400 })
    }

    // Verificar colunas da tabela produtos
    const colunas = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'produtos'
    `

    console.log("Colunas da tabela produtos:", colunas)

    // Verificar se a coluna descricao existe
    const colunasNomes = colunas.map((col) => col.column_name)
    console.log("Nomes das colunas:", colunasNomes)

    // Construir SQL dinamicamente com base nas colunas existentes
    let sql = `
      INSERT INTO produtos (
        id, 
        codigo, 
        nome, 
        categoria, 
    `

    // Adicionar colunas opcionais se existirem
    if (colunasNomes.includes("descricao")) {
      sql += `descricao, `
    }

    // Verificar nomes das colunas para quantidade de estoque e estoque mínimo
    const colunaEstoque =
      colunasNomes.find((col) => col === "quantidadeEstoque" || col === "quantidade_estoque" || col === "estoque") ||
      "quantidadeEstoque"

    const colunaEstoqueMinimo =
      colunasNomes.find((col) => col === "estoqueMinimo" || col === "estoque_minimo" || col === "minimo") ||
      "estoqueMinimo"

    sql += `
        "${colunaEstoque}", 
        "${colunaEstoqueMinimo}", 
        status, 
        "createdAt", 
        "updatedAt"
      ) VALUES (
        gen_random_uuid(), 
        '${data.codigo}', 
        '${data.nome}', 
        '${data.categoria}', 
    `

    // Adicionar valores para colunas opcionais
    if (colunasNomes.includes("descricao")) {
      sql += `'${data.descricao || ""}', `
    }

    sql += `
        ${Number(data.quantidadeEstoque)}, 
        ${Number(data.estoqueMinimo)}, 
        'Ativo', 
        NOW(), 
        NOW()
      )
    `

    console.log("SQL a ser executado:", sql)

    // Executar SQL
    await prisma.$executeRawUnsafe(sql)

    return NextResponse.json(
      {
        success: true,
        message: "Produto criado com sucesso na tabela 'produtos'",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API Produtos Tabela - Erro:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar produto",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
