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
            email: true,
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
    if (!data.nome || !data.email || !data.cargo) {
      return NextResponse.json({ error: "Campos obrigatórios: nome, email e cargo" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    // Create password hash (use default if not provided)
    const hashedPassword = await bcrypt.hash(data.senha || "senha123", 12)

    // Create user and technician in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: data.nome,
          email: data.email,
          password: hashedPassword,
          role: "tecnico",
        },
      })

      // Create technician
      const tecnico = await tx.tecnico.create({
        data: {
          userId: user.id,
          cargo: data.cargo,
          especialidade: data.especialidade || "",
          status: data.status || "Ativo",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
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
