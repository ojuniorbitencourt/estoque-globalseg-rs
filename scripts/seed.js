// Verifique se o script de seed está usando bcryptjs
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando seed do banco de dados...")

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@globalseg.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@globalseg.com",
      password: hashedPassword,
      role: "admin",
    },
  })

  console.log("✅ Usuário admin criado com sucesso")

  console.log("✅ Banco de dados preparado para receber técnicos reais")

  // Criar produtos com as novas categorias e sem preço
  const produtosData = [
    {
      nome: "Câmera de Segurança HD",
      codigo: "CAM-001",
      categoria: "Loja",
      quantidadeEstoque: 50,
    },
    {
      nome: "Sensor de Movimento",
      codigo: "SEN-002",
      categoria: "PGDM",
      quantidadeEstoque: 100,
    },
    {
      nome: "Central de Alarme",
      codigo: "CEN-003",
      categoria: "ATM",
      quantidadeEstoque: 30,
    },
    {
      nome: "Cabo Coaxial (metro)",
      codigo: "CAB-004",
      categoria: "Cortinas",
      quantidadeEstoque: 1000,
    },
    {
      nome: "Sirene para Alarme",
      codigo: "SIR-005",
      categoria: "Loja",
      quantidadeEstoque: 45,
    },
  ]

  const produtos = []

  for (const produtoData of produtosData) {
    const produto = await prisma.produto.upsert({
      where: { codigo: produtoData.codigo },
      update: produtoData,
      create: produtoData,
    })

    produtos.push(produto)
  }

  console.log("✅ Produtos criados com sucesso")

  console.log("✅ Estoque de técnicos criado com sucesso")
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
