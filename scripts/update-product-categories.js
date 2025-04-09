const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Iniciando atualização de categorias de produtos...")

    // Get all products
    const produtos = await prisma.produto.findMany()
    console.log(`📊 Encontrados ${produtos.length} produtos no sistema.`)

    // New categories
    const categorias = ["Loja", "PGDM", "ATM", "Cortinas"]

    // Update each product with a random new category
    let updatedCount = 0
    for (const produto of produtos) {
      // Select a random category from the new ones
      const randomIndex = Math.floor(Math.random() * categorias.length)
      const novaCategoria = categorias[randomIndex]

      // Update the product
      await prisma.produto.update({
        where: { id: produto.id },
        data: { categoria: novaCategoria },
      })

      updatedCount++
    }

    console.log(`✅ Atualizados ${updatedCount} produtos com as novas categorias.`)
    console.log("🚀 As categorias agora são: Loja, PGDM, ATM, Cortinas")
  } catch (error) {
    console.error("❌ Erro ao atualizar categorias:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
