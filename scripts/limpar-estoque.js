// Script para limpar os dados fictícios de produtos e estoque
// Execute com: node scripts/limpar-estoque.js

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function limparDadosFicticios() {
  try {
    console.log("Iniciando limpeza de dados fictícios...")

    // Primeiro, remover registros de estoque de técnicos
    await prisma.estoqueTecnico.deleteMany({})
    console.log("✅ Registros de estoque de técnicos removidos")

    // Remover movimentações de estoque (se existir no seu schema)
    try {
      await prisma.movimentacaoEstoque.deleteMany({})
      console.log("✅ Movimentações de estoque removidas")
    } catch (e) {
      console.log("⚠️ Tabela de movimentações não encontrada ou erro ao limpar")
    }

    // Remover produtos
    await prisma.produto.deleteMany({})
    console.log("✅ Produtos removidos")

    console.log("Limpeza concluída com sucesso!")
  } catch (error) {
    console.error("Erro ao limpar dados:", error)
  } finally {
    await prisma.$disconnect()
  }
}

limparDadosFicticios()
