import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Obter dados do corpo da requisição
    const body = await request.json()
    console.log("Recebendo solicitação de atendimento:", body)

    // Validar dados obrigatórios
    if (!body.tecnicoId) {
      return NextResponse.json({ message: "ID do técnico é obrigatório" }, { status: 400 })
    }

    if (!body.dataAtendimento) {
      return NextResponse.json({ message: "Data do atendimento é obrigatória" }, { status: 400 })
    }

    if (!body.descricao) {
      return NextResponse.json({ message: "Descrição do atendimento é obrigatória" }, { status: 400 })
    }

    if (!body.itens || !Array.isArray(body.itens) || body.itens.length === 0) {
      return NextResponse.json({ message: "Pelo menos um item deve ser selecionado" }, { status: 400 })
    }

    // Verificar se o técnico existe
    const tecnico = await prisma.tecnico.findUnique({
      where: { id: body.tecnicoId },
    })

    if (!tecnico) {
      return NextResponse.json({ message: "Técnico não encontrado" }, { status: 404 })
    }

    // Verificar disponibilidade de produtos no estoque do técnico
    for (const item of body.itens) {
      const estoqueTecnico = await prisma.estoqueTecnico.findUnique({
        where: {
          tecnicoId_produtoId: {
            tecnicoId: body.tecnicoId,
            produtoId: item.produtoId,
          },
        },
      })

      if (!estoqueTecnico) {
        return NextResponse.json(
          { message: `Produto com ID ${item.produtoId} não encontrado no estoque do técnico` },
          { status: 400 },
        )
      }

      if (estoqueTecnico.quantidade < item.quantidade) {
        return NextResponse.json(
          {
            message: `Quantidade insuficiente do produto com ID ${item.produtoId}. Disponível: ${estoqueTecnico.quantidade}`,
          },
          { status: 400 },
        )
      }
    }

    // Usar transação para garantir consistência dos dados
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar o atendimento
      const atendimento = await tx.atendimento.create({
        data: {
          dataAtendimento: new Date(body.dataAtendimento),
          status: body.status,
          descricao: body.descricao,
          observacoes: body.observacoes || "",
          tecnico: {
            connect: {
              id: body.tecnicoId,
            },
          },
          cliente: {
            connectOrCreate: {
              where: {
                codigoAgencia: "ATENDIMENTO-DIRETO",
              },
              create: {
                nome: "Atendimento Direto",
                codigoAgencia: "ATENDIMENTO-DIRETO",
                endereco: body.local || "N/A",
                numero: "N/A",
                bairro: "N/A",
                cidade: "N/A",
                estado: "N/A",
              },
            },
          },
        },
      })

      // 2. Registrar os itens utilizados no atendimento
      for (const item of body.itens) {
        // Criar o item de atendimento
        await tx.itemAtendimento.create({
          data: {
            atendimento: {
              connect: {
                id: atendimento.id,
              },
            },
            produto: {
              connect: {
                id: item.produtoId,
              },
            },
            quantidade: item.quantidade,
          },
        })

        // Atualizar o estoque do técnico
        await tx.estoqueTecnico.update({
          where: {
            tecnicoId_produtoId: {
              tecnicoId: body.tecnicoId,
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

      return atendimento
    })

    return NextResponse.json({ message: "Atendimento registrado com sucesso", atendimento: result }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar atendimento:", error)
    return NextResponse.json(
      { message: "Erro ao registrar atendimento", error: (error as Error).message },
      { status: 500 },
    )
  }
}
