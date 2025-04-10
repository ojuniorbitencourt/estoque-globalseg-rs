import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Consultar informações do esquema do banco de dados
    const tabelas = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    // Consultar colunas da tabela Produto ou produto
    let colunasProduto = []
    try {
      colunasProduto = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Produto'
      `
    } catch (e) {
      console.log("Erro ao buscar colunas de 'Produto', tentando 'produto'")
    }

    if (colunasProduto.length === 0) {
      try {
        colunasProduto = await prisma.$queryRaw`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'produto'
        `
      } catch (e) {
        console.log("Erro ao buscar colunas de 'produto'")
      }
    }

    // Tentar encontrar a tabela correta para produtos
    let tabelaProdutoCorreta = null
    const tabelasPossiveis = ["Produto", "produto", "produtos", "Produtos"]

    for (const tabela of tabelasPossiveis) {
      try {
        const resultado = await prisma.$queryRaw`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tabela}
          )
        `
        if (resultado[0].exists) {
          tabelaProdutoCorreta = tabela
          break
        }
      } catch (e) {
        console.log(`Erro ao verificar tabela ${tabela}`)
      }
    }

    // Consultar colunas da tabela correta se encontrada
    let colunasCorreta = []
    if (tabelaProdutoCorreta) {
      try {
        colunasCorreta = await prisma.$queryRaw`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = ${tabelaProdutoCorreta}
        `
      } catch (e) {
        console.log(`Erro ao buscar colunas de '${tabelaProdutoCorreta}'`)
      }
    }

    return NextResponse.json({
      tabelas,
      colunasProduto,
      tabelaProdutoCorreta,
      colunasCorreta,
    })
  } catch (error) {
    console.error("Erro ao consultar esquema:", error)
    return NextResponse.json({ error: "Erro ao consultar esquema do banco de dados" }, { status: 500 })
  }
}
