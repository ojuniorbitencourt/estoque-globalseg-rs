#!/bin/bash

echo "🌱 Populando banco de dados com dados iniciais..."
node scripts/seed.js

echo "✅ Banco de dados populado com sucesso!"
echo "🚀 Execute 'npm run dev' para iniciar o servidor"
