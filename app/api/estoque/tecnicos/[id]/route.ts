import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const estoqueTecnico = await prisma.estoqueTecnico.findMany({
      where: { tecnicoId: params.id },
      include: {
        produto: true,
      },
      orderBy: {
        produto: {
          nome: "asc",
        },
      },
    })

    return NextResponse.json(estoqueTecnico)
  } catch (error) {
    console.error("Erro ao buscar estoque do técnico:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
