import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const atendimentoUpdateSchema = z.object({
  status: z.string().optional(),
  observacoes: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const atendimento = await prisma.atendimento.findUnique({
      where: { id: params.id },
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
        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    if (!atendimento) {
      return NextResponse.json({ error: "Atendimento não encontrado" }, { status: 404 })
    }

    return NextResponse.json(atendimento)
  } catch (error) {
    console.error("Erro ao buscar atendimento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validar dados
    const validation = atendimentoUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 })
    }

    // Verificar se atendimento existe
    const existingAtendimento = await prisma.atendimento.findUnique({
      where: { id: params.id },
    })

    if (!existingAtendimento) {
      return NextResponse.json({ error: "Atendimento não encontrado" }, { status: 404 })
    }

    // Atualizar atendimento
    const atendimento = await prisma.atendimento.update({
      where: { id: params.id },
      data: {
        status: body.status,
        observacoes: body.observacoes,
      },
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
        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    return NextResponse.json(atendimento)
  } catch (error) {
    console.error("Erro ao atualizar atendimento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se atendimento existe
    const existingAtendimento = await prisma.atendimento.findUnique({
      where: { id: params.id },
      include: {
        itens: true,
      },
    })

    if (!existingAtendimento) {
      return NextResponse.json({ error: "Atendimento não encontrado" }, { status: 404 })
    }

    // Excluir atendimento e devolver itens ao estoque do técnico
    await prisma.$transaction(async (tx) => {
      // Devolver itens ao estoque do técnico
      for (const item of existingAtendimento.itens) {
        // Verificar se o técnico ainda tem o produto no estoque
        const estoqueTecnico = await tx.estoqueTecnico.findUnique({
          where: {
            tecnicoId_produtoId: {
              tecnicoId: existingAtendimento.tecnicoId,
              produtoId: item.produtoId,
            },
          },
        })

        if (estoqueTecnico) {
          // Atualizar estoque existente
          await tx.estoqueTecnico.update({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: existingAtendimento.tecnicoId,
                produtoId: item.produtoId,
              },
            },
            data: {
              quantidade: {
                increment: item.quantidade,
              },
            },
          })
        } else {
          // Criar novo registro de estoque
          await tx.estoqueTecnico.create({
            data: {
              tecnicoId: existingAtendimento.tecnicoId,
              produtoId: item.produtoId,
              quantidade: item.quantidade,
            },
          })
        }
      }

      // Excluir itens do atendimento
      await tx.itemAtendimento.deleteMany({
        where: { atendimentoId: params.id },
      })

      // Excluir atendimento
      await tx.atendimento.delete({
        where: { id: params.id },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir atendimento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
