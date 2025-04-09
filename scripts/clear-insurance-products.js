const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Iniciando limpeza de produtos de seguro...")

    // Find insurance products by their codes (SR-001, SA-002, etc.)
    const insuranceCodes = ["SR-001", "SA-002", "SV-003", "SE-004", "SVI-005"]

    // Delete these products
    const result = await prisma.produto.deleteMany({
      where: {
        codigo: {
          in: insuranceCodes,
        },
      },
    })

    console.log(`✅ Removidos ${result.count} produtos de seguro.`)
    console.log("🚀 O sistema agora está focado apenas em produtos de estoque para técnicos.")
  } catch (error) {
    console.error("❌ Erro ao limpar produtos de seguro:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
