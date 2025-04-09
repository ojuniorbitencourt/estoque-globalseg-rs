#!/bin/bash

echo "🚀 Instalando Sistema ERP - Global Seg"
echo "====================================="

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps

# Gerar Prisma Client
echo "🔄 Gerando Prisma Client..."
npx prisma generate

# Criar banco de dados e executar migrações
echo "🗃️ Criando banco de dados e executando migrações..."
npx prisma migrate dev --name init || npx prisma db push

# Instalar ts-node se necessário
if ! command -v ts-node &> /dev/null; then
    echo "📦 Instalando ts-node..."
    npm install -D ts-node
fi

# Popular banco de dados
echo "🌱 Populando banco de dados com dados iniciais..."
npx ts-node scripts/seed.ts

echo "✅ Instalação concluída!"
echo "🚀 Execute 'npm run dev' para iniciar o servidor"
echo "🌐 Acesse http://localhost:3000 no seu navegador"
echo "📝 Credenciais de acesso:"
echo "   Email: admin@globalseg.com"
echo "   Senha: admin123"
