import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar contagem de produtos
    const totalProdutos = await prisma.produto.count({
      where: { status: "Ativo" },
    })

    // Buscar contagem de técnicos ativos
    const tecnicosAtivos = await prisma.tecnico.count({
      where: { status: "Ativo" },
    })

    // Buscar contagem de clientes
    const totalClientes = await prisma.cliente.count({
      where: { status: "Ativo" },
    })

    // Buscar atendimentos em andamento
    const atendimentosEmAndamento = await prisma.atendimento.count({
      where: { status: "Em Andamento" },
    })

    // Buscar atendimentos recentes
    const atendimentosRecentes = await prisma.atendimento.findMany({
      take: 5,
      orderBy: { dataAtendimento: "desc" },
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
      },
    })

    // Formatar atendimentos para a resposta
    const atendimentosFormatados = atendimentosRecentes.map((atendimento) => ({
      id: atendimento.id,
      tecnicoNome: atendimento.tecnico.user.name,
      dataAtendimento: new Date(atendimento.dataAtendimento).toLocaleDateString("pt-BR"),
      local: atendimento.observacoes || "N/A",
      status: atendimento.status,
    }))

    // Buscar vendas recentes (simulado, pois não temos modelo de vendas no schema)
    const vendasRecentes = []

    return NextResponse.json({
      totalProdutos,
      tecnicosAtivos,
      totalClientes,
      atendimentosEmAndamento,
      atendimentosRecentes: atendimentosFormatados,
      vendasRecentes,
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
