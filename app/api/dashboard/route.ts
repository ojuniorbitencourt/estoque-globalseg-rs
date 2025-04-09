import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar dados reais do banco de dados usando Promise.all para melhor performance
    const [
      totalClientes,
      totalTecnicos,
      totalProdutos,
      produtosBaixoEstoque, // Nome da variável aqui
      atendimentosRecentes,
      atendimentosAbertos,
      atendimentosEmAndamento,
      atendimentosConcluidos,
    ] = await Promise.all([
      prisma.cliente.count(),
      prisma.tecnico.count(),
      prisma.produto.count(),
      prisma.produto.findMany({
        where: { quantidadeEstoque: { lt: 10 } },
        orderBy: { quantidadeEstoque: "asc" },
        take: 5,
      }),
      prisma.atendimento.findMany({
        take: 5,
        orderBy: { dataAtendimento: "desc" },
        include: {
          cliente: true,
          tecnico: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.atendimento.count({ where: { status: "Aberto" } }),
      prisma.atendimento.count({ where: { status: "Em Andamento" } }),
      prisma.atendimento.count({ where: { status: "Concluído" } }),
    ])

    // Calcular totais
    const totalAtendimentos = atendimentosAbertos + atendimentosEmAndamento + atendimentosConcluidos

    // Retornar dados formatados
    return NextResponse.json({
      resumo: {
        totalClientes,
        totalTecnicos,
        totalProdutos,
        atendimentosEmAndamento,
        produtosEstoqueBaixo: produtosBaixoEstoque.length,
        totalAtendimentos,
      },
      atendimentos: {
        recentes: atendimentosRecentes,
      },
      estoque: {
        produtosBaixoEstoque, // Corrigido para usar o mesmo nome da variável
      },
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)

    // Registrar o erro completo para depuração
    console.error("Detalhes do erro:", JSON.stringify(error, null, 2))

    // Retornar resposta de erro com detalhes
    return NextResponse.json(
      {
        error: "Erro ao buscar dados do dashboard",
        details: process.env.NODE_ENV === "development" ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
