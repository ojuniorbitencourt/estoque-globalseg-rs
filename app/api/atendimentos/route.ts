import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const atendimentos = await prisma.atendimento.findMany({
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
        itens: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        dataAtendimento: "desc",
      },
    })

    return NextResponse.json(atendimentos)
  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Criar atendimento
    const atendimento = await prisma.atendimento.create({
      data: {
        tecnicoId: data.tecnicoId,
        clienteId: data.clienteId,
        dataAtendimento: new Date(data.dataAtendimento),
        status: data.status,
        descricao: data.descricao,
        observacoes: data.observacoes,
      },
    })

    // Adicionar itens ao atendimento
    if (data.itens && data.itens.length > 0) {
      for (const item of data.itens) {
        await prisma.itemAtendimento.create({
          data: {
            atendimentoId: atendimento.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          },
        })

        // Atualizar estoque do técnico
        await prisma.estoqueTecnico.update({
          where: {
            tecnicoId_produtoId: {
              tecnicoId: data.tecnicoId,
              produtoId: item.produtoId,
            },
          },
          data: {
            quantidade: {
              decrement: item.quantidade,
            },
          },
        })
      }
    }

    return NextResponse.json(atendimento)
  } catch (error) {
    console.error("Erro ao criar atendimento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
