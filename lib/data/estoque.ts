import { prisma } from "@/lib/prisma"

// Definir o limite mínimo de estoque (poderia vir de configurações)
const ESTOQUE_MINIMO_PADRAO = 5

export async function getEstoqueBaixo() {
  try {
    // Buscar produtos com estoque abaixo do mínimo
    const produtosBaixoEstoque = await prisma.produto.findMany({
      where: {
        status: "Ativo",
        quantidadeEstoque: {
          lte: ESTOQUE_MINIMO_PADRAO,
        },
      },
      orderBy: {
        quantidadeEstoque: "asc",
      },
      take: 5, // Limitar a 5 itens para o dashboard
    })

    // Adicionar o estoque mínimo para cada produto
    const produtosFormatados = produtosBaixoEstoque.map((produto) => ({
      ...produto,
      estoqueMinimo: ESTOQUE_MINIMO_PADRAO,
    }))

    return produtosFormatados
  } catch (error) {
    console.error("Erro ao buscar produtos com estoque baixo:", error)
    return []
  }
}

export async function getTotalProdutosBaixoEstoque() {
  try {
    // Contar produtos com estoque abaixo do mínimo
    const count = await prisma.produto.count({
      where: {
        status: "Ativo",
        quantidadeEstoque: {
          lte: ESTOQUE_MINIMO_PADRAO,
        },
      },
    })

    return count
  } catch (error) {
    console.error("Erro ao contar produtos com estoque baixo:", error)
    return 0
  }
}
