import { prisma } from "@/lib/prisma"
import { getTotalProdutosBaixoEstoque } from "./estoque"
import { getTotalTecnicosAtivos } from "./tecnicos"

export async function getDashboardStats() {
  try {
    // Buscar contagem de produtos
    const totalProdutos = await prisma.produto.count({
      where: { status: "Ativo" },
    })

    // Buscar contagem de técnicos ativos
    const tecnicosAtivos = await getTotalTecnicosAtivos()

    // Buscar contagem de clientes
    const totalClientes = await prisma.cliente.count({
      where: { status: "Ativo" },
    })

    // Buscar contagem de atendimentos
    const totalAtendimentos = await prisma.atendimento.count()

    // Buscar atendimentos em andamento
    const atendimentosEmAndamento = await prisma.atendimento.count({
      where: { status: "Em Andamento" },
    })

    // Buscar produtos com estoque baixo
    const produtosBaixoEstoque = await getTotalProdutosBaixoEstoque()

    return {
      totalProdutos,
      tecnicosAtivos,
      totalClientes,
      totalAtendimentos,
      atendimentosEmAndamento,
      produtosBaixoEstoque,
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error)
    return {
      totalProdutos: 0,
      tecnicosAtivos: 0,
      totalClientes: 0,
      totalAtendimentos: 0,
      atendimentosEmAndamento: 0,
      produtosBaixoEstoque: 0,
    }
  }
}
