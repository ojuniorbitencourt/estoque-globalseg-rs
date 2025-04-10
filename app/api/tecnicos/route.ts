import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const tecnicos = await prisma.tecnico.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    })

    return NextResponse.json(tecnicos)
  } catch (error) {
    console.error("Erro ao buscar técnicos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.nome || !data.cargo) {
      return NextResponse.json({ error: "Campos obrigatórios: nome e cargo" }, { status: 400 })
    }

    // Create password hash (always use default)
    const hashedPassword = await bcrypt.hash("senha123", 12)

    // Create user and technician in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with a generated email
      const user = await tx.user.create({
        data: {
          name: data.nome,
          email: `tecnico_${Date.now()}@globalseg.local`, // Email gerado automaticamente
          password: hashedPassword,
          role: "tecnico",
        },
      })

      // Create technician with default status "Ativo"
      const tecnico = await tx.tecnico.create({
        data: {
          userId: user.id,
          cargo: data.cargo,
          status: "Ativo", // Status padrão sempre "Ativo"
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      })

      return { user, tecnico }
    })

    return NextResponse.json(result.tecnico, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar técnico:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
