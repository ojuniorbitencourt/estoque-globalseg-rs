import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
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

    return NextResponse.json(estoqueFormatado)
  } catch (error) {
    console.error("Erro ao buscar estoque por técnico:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
