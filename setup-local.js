const fs = require("fs")
const { execSync } = require("child_process")

console.log("🚀 Configuração do Sistema ERP - Global Seg")
console.log("===========================================")

// Verificar se o arquivo .env existe
if (fs.existsSync(".env")) {
  console.log("✅ Arquivo .env já existe.")
} else {
  console.log("📝 Criando arquivo .env...")
  fs.writeFileSync(
    ".env",
    `# Variáveis de ambiente
NEXT_PUBLIC_APP_NAME="Sistema ERP - Global Seg"
DATABASE_URL="postgresql://seu_usuario:sua_senha@seu_host:5432/seu_banco"
JWT_SECRET="globalseg-jwt-secret-key-2024"
`,
  )
  console.log("✅ Arquivo .env criado com sucesso!")
}

// Verificar e instalar dependências
console.log("📦 Verificando dependências...")
try {
  // Verificar se o node_modules existe
  if (!fs.existsSync("node_modules")) {
    console.log("⚙️ Instalando dependências...")
    execSync("npm install", { stdio: "inherit" })
    console.log("✅ Dependências instaladas com sucesso!")
  } else {
    console.log("✅ Dependências já instaladas.")
  }

  // Verificar se bcryptjs está instalado
  try {
    require.resolve("bcryptjs")
  } catch (e) {
    console.log("⚙️ Instalando bcryptjs...")
    execSync("npm install bcryptjs", { stdio: "inherit" })
    console.log("✅ bcryptjs instalado com sucesso!")
  }

  // Gerar Prisma Client
  console.log("🔄 Gerando Prisma Client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Executar migrações
  console.log("🗃️ Criando banco de dados e executando migrações...")
  execSync("npx prisma db push", { stdio: "inherit" })

  // Popular banco de dados
  console.log("🌱 Populando banco de dados com dados iniciais...")
  execSync("node scripts/seed.js", { stdio: "inherit" })

  console.log("✅ Configuração concluída com sucesso!")
  console.log("🚀 Execute 'npm run dev' para iniciar o servidor de desenvolvimento.")
} catch (error) {
  console.error(`❌ Erro ao configurar o projeto: ${error.message}`)
  process.exit(1)
}
