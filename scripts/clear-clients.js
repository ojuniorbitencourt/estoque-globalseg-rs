const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Iniciando limpeza de clientes...")

    // Verifica se o modelo atendimento existe antes de tentar excluir
    if (prisma.atendimento && typeof prisma.atendimento.deleteMany === "function") {
      console.log("🗑️ Removendo atendimentos relacionados...")
      const atendimentosRemovidos = await prisma.atendimento.deleteMany({})
      console.log(`✅ ${atendimentosRemovidos.count} atendimentos removidos com sucesso!`)
    } else {
      console.log("⚠️ Modelo de atendimento não encontrado, pulando esta etapa.")
    }

    // Verifica se o modelo cliente existe antes de tentar excluir
    if (prisma.cliente && typeof prisma.cliente.deleteMany === "function") {
      console.log("🗑️ Removendo clientes...")
      const clientesRemovidos = await prisma.cliente.deleteMany({})
      console.log(`✅ ${clientesRemovidos.count} clientes removidos com sucesso!`)
    } else {
      console.log("⚠️ Modelo de cliente não encontrado, pulando esta etapa.")
    }

    console.log("🎉 Limpeza de clientes concluída com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao limpar clientes:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
