const { execSync } = require("child_process")
const fs = require("fs")

console.log("🚀 Instalando dependências do Sistema ERP - Global Seg")
console.log("===========================================")

try {
  console.log("📦 Instalando bcryptjs...")
  execSync("npm install bcryptjs", { stdio: "inherit" })
  console.log("✅ bcryptjs instalado com sucesso!")

  console.log("📦 Instalando todas as dependências...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Todas as dependências instaladas com sucesso!")

  console.log("🔄 Gerando Prisma Client...")
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("✅ Prisma Client gerado com sucesso!")

  console.log("🚀 Sistema pronto para uso!")
  console.log("Execute 'npm run dev' para iniciar o servidor de desenvolvimento")
} catch (error) {
  console.error("❌ Erro ao instalar dependências:", error.message)
  process.exit(1)
}
