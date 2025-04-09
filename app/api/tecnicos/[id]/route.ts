import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log("API: Fetching technician with ID:", id)

    // Verificar se o ID é válido
    if (!id) {
      console.log("API: Missing technician ID")
      return NextResponse.json({ error: "ID do técnico não fornecido" }, { status: 400 })
    }

    // Buscar o técnico com todas as informações relacionadas
    const tecnico = await prisma.tecnico.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        estoqueTecnico: {
          // Changed from estoque to estoqueTecnico to match the schema
          include: {
            produto: true,
          },
        },
        atendimentos: {
          include: {
            itens: {
              include: {
                produto: true,
              },
            },
          },
          orderBy: {
            dataAtendimento: "desc",
          },
          take: 10,
        },
      },
    })

    if (!tecnico) {
      console.log("API: Technician not found")
      return NextResponse.json({ error: "Técnico não encontrado" }, { status: 404 })
    }

    console.log("API: Technician found:", tecnico)
    return NextResponse.json(tecnico)
  } catch (error) {
    console.error("API: Error fetching technician details:", error)
    return NextResponse.json({ error: "Erro ao buscar detalhes do técnico" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    console.log("API: Updating technician with ID:", id, "Data:", body)

    // Verificar se o técnico existe
    const existingTecnico = await prisma.tecnico.findUnique({
      where: { id },
    })

    if (!existingTecnico) {
      console.log("API: Technician not found for update")
      return NextResponse.json({ error: "Técnico não encontrado" }, { status: 404 })
    }

    // Atualizar técnico
    const tecnico = await prisma.tecnico.update({
      where: { id },
      data: {
        cargo: body.cargo,
        especialidade: body.especialidade,
        status: body.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // Se houver dados do usuário para atualizar
    if (body.user) {
      await prisma.user.update({
        where: { id: tecnico.userId },
        data: {
          name: body.user.name,
          email: body.user.email,
        },
      })
    }

    console.log("API: Technician updated successfully")
    return NextResponse.json(tecnico)
  } catch (error) {
    console.error("API: Error updating technician:", error)
    return NextResponse.json({ error: "Erro ao atualizar técnico" }, { status: 500 })
  }
}
