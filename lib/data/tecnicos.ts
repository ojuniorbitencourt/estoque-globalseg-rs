import { prisma } from "@/lib/prisma"

export async function getEstoqueTecnicos() {
  try {
    // Buscar estoque por técnico
    const estoqueTecnicos = await prisma.estoqueTecnico.findMany({
      include: {
        tecnico: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        produto: {
          select: {
            nome: true,
            codigo: true,
          },
        },
      },
      orderBy: [
        {
          tecnico: {
            user: {
              name: "asc",
            },
          },
        },
        {
          produto: {
            nome: "asc",
          },
        },
      ],
      take: 10, // Limitar a 10 itens para o dashboard
    })

    // Formatar dados para a resposta
    const estoqueFormatado = estoqueTecnicos.map((item) => ({
      tecnicoId: item.tecnicoId,
      tecnicoNome: item.tecnico.user.name,
      produtoId: item.produtoId,
      produtoNome: item.produto.nome,
      produtoCodigo: item.produto.codigo,
      quantidade: item.quantidade,
    }))

    return estoqueFormatado
  } catch (error) {
    console.error("Erro ao buscar estoque por técnico:", error)
    return []
  }
}

export async function getTotalTecnicosAtivos() {
  try {
    // Contar técnicos ativos
    const count = await prisma.tecnico.count({
      where: {
        status: "Ativo",
      },
    })

    return count
  } catch (error) {
    console.error("Erro ao contar técnicos ativos:", error)
    return 0
  }
}
