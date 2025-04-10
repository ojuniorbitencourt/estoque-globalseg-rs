import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("API SQL - Dados recebidos:", data)

    // Validações básicas
    if (!data.codigo || !data.nome || !data.categoria) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se já existe um produto com o mesmo código
    const produtoExistente = await prisma.$queryRaw`
      SELECT id FROM "Produto" WHERE codigo = ${data.codigo} LIMIT 1
    `

    if (Array.isArray(produtoExistente) && produtoExistente.length > 0) {
      return NextResponse.json({ error: "Código já existe" }, { status: 400 })
    }

    // Inserir produto usando SQL direto
    console.log("API SQL - Inserindo produto via SQL direto")

    try {
      await prisma.$executeRaw`
        INSERT INTO "Produto" (
          id, 
          codigo, 
          nome, 
          categoria, 
          descricao, 
          "quantidadeEstoque", 
          "estoqueMinimo", 
          status, 
          "createdAt", 
          "updatedAt"
        ) VALUES (
          gen_random_uuid(), 
          ${data.codigo}, 
          ${data.nome}, 
          ${data.categoria}, 
          ${data.descricao}, 
          ${Number(data.quantidadeEstoque)}, 
          ${Number(data.estoqueMinimo)}, 
          'Ativo', 
          NOW(), 
          NOW()
        )
      `

      return NextResponse.json(
        {
          success: true,
          message: "Produto criado com sucesso via SQL",
        },
        { status: 201 },
      )
    } catch (sqlError) {
      console.error("API SQL - Erro ao executar SQL:", sqlError)

      // Tentar com outro formato de SQL
      try {
        console.log("API SQL - Tentando formato alternativo")
        await prisma.$executeRaw`
          INSERT INTO "Produto" (
            "id", 
            "codigo", 
            "nome", 
            "categoria", 
            "descricao", 
            "quantidadeEstoque", 
            "estoqueMinimo", 
            "status", 
            "createdAt", 
            "updatedAt"
          ) VALUES (
            gen_random_uuid(), 
            ${data.codigo}, 
            ${data.nome}, 
            ${data.categoria}, 
            ${data.descricao}, 
            ${Number(data.quantidadeEstoque)}, 
            ${Number(data.estoqueMinimo)}, 
            'Ativo', 
            NOW(), 
            NOW()
          )
        `

        return NextResponse.json(
          {
            success: true,
            message: "Produto criado com sucesso via SQL alternativo",
          },
          { status: 201 },
        )
      } catch (altSqlError) {
        console.error("API SQL - Erro no formato alternativo:", altSqlError)
        throw altSqlError
      }
    }
  } catch (error) {
    console.error("API SQL - Erro geral:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar produto via SQL",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
