import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema para validação do atendimento
const atendimentoSchema = z.object({
  tecnicoId: z.string().uuid(),
  dataAtendimento: z.string(),
  local: z.string().min(3, "Local é obrigatório"),
  status: z.string(),
  descricao: z.string().min(3, "Descrição é obrigatória"),
  observacoes: z.string().optional(),
  itens: z
    .array(
      z.object({
        produtoId: z.string().uuid(),
        quantidade: z.number().int().positive(),
      }),
    )
    .min(1, "Pelo menos um item é obrigatório"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Recebendo solicitação de atendimento:", body)

    // Validar dados
    const validation = atendimentoSchema.safeParse(body)
    if (!validation.success) {
      console.error("Erro de validação:", validation.error.format())
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 })
    }

    // Verificar se o técnico existe
    const tecnico = await prisma.tecnico.findUnique({
      where: { id: body.tecnicoId },
    })

    if (!tecnico) {
      return NextResponse.json({ error: "Técnico não encontrado" }, { status: 404 })
    }

    // Verificar se os produtos existem e se o técnico tem quantidade suficiente
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
        return NextResponse.json({ error: `Produto não encontrado no estoque do técnico` }, { status: 400 })
      }

      if (estoqueTecnico.quantidade < item.quantidade) {
        return NextResponse.json(
          { error: `Quantidade insuficiente para o produto. Disponível: ${estoqueTecnico.quantidade}` },
          { status: 400 },
        )
      }
    }

    // Criar atendimento e dar baixa nos produtos em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar o atendimento
      const atendimento = await tx.atendimento.create({
        data: {
          dataAtendimento: new Date(body.dataAtendimento),
          local: body.local,
          status: body.status,
          descricao: body.descricao,
          observacoes: body.observacoes || "",
          // Conectar ao técnico existente
          tecnico: {
            connect: { id: body.tecnicoId },
          },
          // Criar um cliente fictício se necessário
          cliente: {
            connectOrCreate: {
              where: { codigoAgencia: "ATENDIMENTO-DIRETO" },
              create: {
                nome: "Atendimento Direto",
                codigoAgencia: "ATENDIMENTO-DIRETO",
                endereco: "N/A",
                numero: "N/A",
                bairro: "N/A",
                cidade: "N/A",
                estado: "N/A",
              },
            },
          },
        },
      })

      console.log("Atendimento criado:", atendimento)

      // 2. Adicionar itens ao atendimento e dar baixa no estoque do técnico
      for (const item of body.itens) {
        // Adicionar item ao atendimento
        await tx.itemAtendimento.create({
          data: {
            atendimentoId: atendimento.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          },
        })

        // Dar baixa no estoque do técnico
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

        console.log(`Baixa de ${item.quantidade} unidades do produto ${item.produtoId} realizada`)
      }

      // Buscar o atendimento completo para retornar
      return await tx.atendimento.findUnique({
        where: { id: atendimento.id },
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
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar atendimento:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
