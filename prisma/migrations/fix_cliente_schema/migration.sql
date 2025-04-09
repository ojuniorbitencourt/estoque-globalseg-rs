-- Modificar a tabela Cliente para adicionar os novos campos e remover os antigos
ALTER TABLE "Cliente" ADD COLUMN IF NOT EXISTS "codigoAgencia" TEXT;
ALTER TABLE "Cliente" ADD COLUMN IF NOT EXISTS "bairro" TEXT;

-- Atualizar os campos existentes para serem opcionais ou obrigatórios conforme necessário
ALTER TABLE "Cliente" ALTER COLUMN "nome" SET NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "codigoAgencia" SET NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "telefone" DROP NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "endereco" SET NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "numero" SET NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "bairro" SET NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "cidade" SET NOT NULL;
ALTER TABLE "Cliente" ALTER COLUMN "estado" SET NOT NULL;

-- Definir valores padrão para os novos campos obrigatórios em registros existentes
UPDATE "Cliente" SET "codigoAgencia" = '0000' WHERE "codigoAgencia" IS NULL;
UPDATE "Cliente" SET "bairro" = 'Centro' WHERE "bairro" IS NULL;
UPDATE "Cliente" SET "endereco" = 'Endereço não informado' WHERE "endereco" IS NULL;
UPDATE "Cliente" SET "numero" = 'S/N' WHERE "numero" IS NULL;
UPDATE "Cliente" SET "cidade" = 'Cidade não informada' WHERE "cidade" IS NULL;
UPDATE "Cliente" SET "estado" = 'UF' WHERE "estado" IS NULL;
