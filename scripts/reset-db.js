const { PrismaClient } = require("@prisma/client")
const { execSync } = require("child_process")

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Iniciando reset do banco de dados...")

    // Ordem correta de exclusão para respeitar todas as relações
    const deleteOrder = [
      "itemAtendimento",
      "atendimento",
      "movimentacaoEstoque",
      "estoqueTecnico",
      "documento",
      "tecnico",
      "produto",
      "cliente",
      "user",
    ]

    // Exclui os dados em ordem
    for (const model of deleteOrder) {
      try {
        if (prisma[model] && typeof prisma[model].deleteMany === "function") {
          console.log(`🗑️ Removendo dados de ${model}...`)
          const result = await prisma[model].deleteMany({})
          console.log(`✅ ${result.count} registros de ${model} removidos com sucesso!`)
        } else {
          console.log(`⚠️ Modelo ${model} não encontrado, pulando...`)
        }
      } catch (error) {
        console.error(`❌ Erro ao remover dados de ${model}:`, error.message)
      }
    }

    console.log("🎉 Reset do banco de dados concluído com sucesso!")

    // Executar o seed
    console.log("🌱 Executando seed para popular o banco de dados...")
    execSync("node scripts/seed.js", { stdio: "inherit" })

    console.log("✅ Processo de reset e seed concluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao resetar banco de dados:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
