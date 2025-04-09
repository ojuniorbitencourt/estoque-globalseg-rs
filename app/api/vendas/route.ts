import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const vendaSchema = z.object({
  clienteId: z.string().uuid(),
  produtoId: z.string().uuid(),
  valor: z.number().positive(),
  status: z.string().default("Pendente"),
  pagamento: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        cliente: true,
        produto: true,
      },
      orderBy: { data: "desc" },
    })

    return NextResponse.json(vendas)
  } catch (error) {
    console.error("Erro ao buscar vendas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados
    const validation = vendaSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 })
    }

    // Verificar se cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: body.clienteId },
    })

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 400 })
    }

    // Verificar se produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: body.produtoId },
    })

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 400 })
    }

    // Criar venda
    const venda = await prisma.venda.create({
      data: body,
      include: {
        cliente: true,
        produto: true,
      },
    })

    return NextResponse.json(venda, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar venda:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
