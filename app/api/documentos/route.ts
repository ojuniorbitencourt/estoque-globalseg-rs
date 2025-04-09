import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const documentoSchema = z.object({
  nome: z.string().min(3),
  tipo: z.string(),
  tamanho: z.string(),
  categoria: z.string(),
  autor: z.string(),
  url: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const documentos = await prisma.documento.findMany({
      orderBy: { nome: "asc" },
    })

    return NextResponse.json(documentos)
  } catch (error) {
    console.error("Erro ao buscar documentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados
    const validation = documentoSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 })
    }

    // Criar documento
    const documento = await prisma.documento.create({
      data: body,
    })

    return NextResponse.json(documento, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar documento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
