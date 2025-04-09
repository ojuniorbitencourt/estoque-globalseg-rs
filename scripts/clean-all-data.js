const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Iniciando limpeza completa do banco de dados...")

    // Get admin user to preserve it
    const adminUser = await prisma.user.findFirst({
      where: {
        email: "admin@globalseg.com",
        role: "admin",
      },
    })

    if (!adminUser) {
      console.log("⚠️ Usuário administrador não encontrado!")
    } else {
      console.log("👤 Usuário administrador encontrado e será preservado.")
    }

    // Clean up in the correct order to respect foreign key constraints
    console.log("🗑️ Removendo itens de atendimento...")
    await prisma.itemAtendimento.deleteMany()

    console.log("🗑️ Removendo atendimentos...")
    await prisma.atendimento.deleteMany()

    console.log("🗑️ Removendo movimentações de estoque...")
    await prisma.movimentacaoEstoque.deleteMany()

    console.log("🗑️ Removendo estoque de técnicos...")
    await prisma.estoqueTecnico.deleteMany()

    console.log("🗑️ Removendo documentos...")
    await prisma.documento.deleteMany()

    console.log("🗑️ Removendo técnicos...")
    await prisma.tecnico.deleteMany()

    console.log("🗑️ Removendo produtos...")
    await prisma.produto.deleteMany()

    console.log("🗑️ Removendo clientes...")
    await prisma.cliente.deleteMany()

    // Delete all users except admin
    if (adminUser) {
      console.log("🗑️ Removendo usuários (exceto admin)...")
      await prisma.user.deleteMany({
        where: {
          id: { not: adminUser.id },
        },
      })
    } else {
      console.log("🗑️ Removendo todos os usuários...")
      await prisma.user.deleteMany()
    }

    console.log("✅ Limpeza completa concluída com sucesso!")
    console.log("🚀 O sistema está pronto para receber dados reais.")
  } catch (error) {
    console.error("❌ Erro ao limpar banco de dados:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
