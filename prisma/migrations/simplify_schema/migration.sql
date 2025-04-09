-- Remover a relação entre Atendimento e Cliente
ALTER TABLE "Atendimento" DROP CONSTRAINT IF EXISTS "Atendimento_clienteId_fkey";

-- Remover a coluna clienteId da tabela Atendimento
ALTER TABLE "Atendimento" DROP COLUMN IF EXISTS "clienteId";

-- Adicionar a coluna local à tabela Atendimento
ALTER TABLE "Atendimento" ADD COLUMN IF NOT EXISTS "local" TEXT;

-- Atualizar os registros existentes para ter um valor padrão para local
UPDATE "Atendimento" SET "local" = 'Local não especificado' WHERE "local" IS NULL;

-- Tornar a coluna local obrigatória
ALTER TABLE "Atendimento" ALTER COLUMN "local" SET NOT NULL;
