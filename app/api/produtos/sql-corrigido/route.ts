import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("API SQL Corrigido - Dados recebidos:", data)

    // Validações básicas
    if (!data.codigo || !data.nome || !data.categoria) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se já existe um produto com o mesmo código
    // Tentando com diferentes nomes de tabela
    let produtoExistente = null

    try {
      // Tentativa 1: tabela "produto"
      produtoExistente = await prisma.$queryRaw`
        SELECT id FROM produto WHERE codigo = ${data.codigo} LIMIT 1
      `
    } catch (e) {
      console.log("Erro ao verificar em 'produto', tentando 'Produto'")
      try {
        // Tentativa 2: tabela "Produto"
        produtoExistente = await prisma.$queryRaw`
          SELECT id FROM "Produto" WHERE codigo = ${data.codigo} LIMIT 1
        `
      } catch (e2) {
        console.log("Erro ao verificar em 'Produto', tentando 'produtos'")
        try {
          // Tentativa 3: tabela "produtos"
          produtoExistente = await prisma.$queryRaw`
            SELECT id FROM produtos WHERE codigo = ${data.codigo} LIMIT 1
          `
        } catch (e3) {
          console.log("Erro ao verificar em 'produtos'")
        }
      }
    }

    if (Array.isArray(produtoExistente) && produtoExistente.length > 0) {
      return NextResponse.json({ error: "Código já existe" }, { status: 400 })
    }

    // Inserir produto usando SQL direto - tentando diferentes nomes de tabela
    console.log("API SQL Corrigido - Inserindo produto via SQL direto")

    // Lista de possíveis nomes de tabela
    const tabelasPossiveis = ["produto", "Produto", "produtos", "Produtos"]
    let sucesso = false
    let erro = null

    for (const tabela of tabelasPossiveis) {
      try {
        console.log(`Tentando inserir na tabela "${tabela}"`)

        // Verificar se a tabela existe
        const tabelaExiste = await prisma.$queryRaw`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tabela}
          )
        `

        if (!tabelaExiste[0].exists) {
          console.log(`Tabela "${tabela}" não existe, pulando...`)
          continue
        }

        // Verificar colunas da tabela
        const colunas = await prisma.$queryRaw`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = ${tabela}
        `

        console.log(`Colunas da tabela "${tabela}":`, colunas)

        // Verificar se a coluna descricao existe
        const temDescricao = colunas.some(
          (col) =>
            col.column_name === "descricao" || col.column_name === "descrição" || col.column_name === "descricao",
        )

        // Construir SQL dinamicamente com base nas colunas existentes
        const sql = `
          INSERT INTO "${tabela}" (
            id, 
            codigo, 
            nome, 
            categoria, 
            ${temDescricao ? "descricao," : ""} 
            "quantidadeEstoque", 
            "estoqueMinimo", 
            status, 
            "createdAt", 
            "updatedAt"
          ) VALUES (
            gen_random_uuid(), 
            '${data.codigo}', 
            '${data.nome}', 
            '${data.categoria}', 
            ${temDescricao ? `'${data.descricao || ""}',` : ""} 
            ${Number(data.quantidadeEstoque)}, 
            ${Number(data.estoqueMinimo)}, 
            'Ativo', 
            NOW(), 
            NOW()
          )
        `

        // Executar SQL
        await prisma.$executeRawUnsafe(sql)

        sucesso = true
        console.log(`Produto inserido com sucesso na tabela "${tabela}"`)
        break
      } catch (error) {
        console.error(`Erro ao inserir na tabela "${tabela}":`, error)
        erro = error
      }
    }

    if (sucesso) {
      return NextResponse.json(
        {
          success: true,
          message: "Produto criado com sucesso",
        },
        { status: 201 },
      )
    } else {
      throw erro || new Error("Falha ao inserir produto em todas as tabelas possíveis")
    }
  } catch (error) {
    console.error("API SQL Corrigido - Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar produto",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
