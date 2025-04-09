const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Iniciando limpeza do banco de dados...")

    // Ordem correta de exclusão para respeitar todas as relações
    const deleteOrder = [
      // Primeiro os modelos mais dependentes (folhas da árvore de dependências)
      "itemAtendimento", // Depende de atendimento e produto
      "atendimento", // Depende de tecnico
      "movimentacaoEstoque", // Depende de produto e estoqueTecnico
      "estoqueTecnico", // Depende de tecnico e produto
      "documento", // Pode depender de outros modelos
      "tecnico", // Depende de user
      "produto", // Independente
      "user", // Independente (mas outros dependem dele)
    ]

    // Exclui os dados em ordem
    for (const model of deleteOrder) {
      try {
        // Verifica se o modelo existe
        if (prisma[model] && typeof prisma[model].deleteMany === "function") {
          console.log(`🗑️ Removendo dados de ${model}...`)
          const result = await prisma[model].deleteMany({})
          console.log(`✅ ${result.count} registros de ${model} removidos com sucesso!`)
        } else {
          console.log(`⚠️ Modelo ${model} não encontrado, pulando...`)
        }
      } catch (error) {
        console.error(`❌ Erro ao remover dados de ${model}:`, error.message)
        // Continua com o próximo modelo em vez de interromper todo o processo
      }
    }

    console.log("🎉 Limpeza do banco de dados concluída com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao limpar banco de dados:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
