import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema for product validation
const produtoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  codigo: z.string().min(3, "Código deve ter pelo menos 3 caracteres"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  quantidadeEstoque: z.number().int().nonnegative(),
  status: z.string().default("Ativo"),
})

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching all products from database")
    const produtos = await prisma.produto.findMany({
      orderBy: {
        nome: "asc",
      },
    })

    console.log(`Found ${produtos.length} products`)
    return NextResponse.json(produtos)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Creating new product")
    const body = await request.json()
    console.log("Request body:", body)

    // Validate data
    const validation = produtoSchema.safeParse(body)
    if (!validation.success) {
      console.error("Validation error:", validation.error.format())
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 })
    }

    // Check if code already exists
    const existingProduct = await prisma.produto.findUnique({
      where: { codigo: body.codigo },
    })

    if (existingProduct) {
      console.error("Product code already exists:", body.codigo)
      return NextResponse.json({ error: "Código de produto já cadastrado" }, { status: 400 })
    }

    // Create product in database
    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        codigo: body.codigo,
        categoria: body.categoria,
        quantidadeEstoque: body.quantidadeEstoque,
        status: body.status || "Ativo",
      },
    })

    console.log("Product created successfully:", produto)
    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
