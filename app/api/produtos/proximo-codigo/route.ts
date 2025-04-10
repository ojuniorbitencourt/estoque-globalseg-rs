import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")

    if (!categoria) {
      return NextResponse.json({ error: "Categoria é obrigatória" }, { status: 400 })
    }

    // Prefixos para cada categoria
    const prefixos = {
      PGDM: "PGDM",
      ATM: "ATM",
      "Cortinas Eletrônicas": "CRT",
      "Loja Ferragens": "LFG",
    }

    const prefixo = prefixos[categoria] || categoria.substring(0, 3).toUpperCase()

    // Buscar produtos com o mesmo prefixo
    const produtos = await prisma.produto.findMany({
      where: {
        codigo: {
          startsWith: `${prefixo}-`,
        },
      },
      select: {
        codigo: true,
      },
    })

    // Encontrar o maior número sequencial atual
    let maiorSequencial = 0

    produtos.forEach((produto) => {
      const partes = produto.codigo.split("-")
      if (partes.length === 2) {
        const sequencial = Number.parseInt(partes[1], 10)
        if (!isNaN(sequencial) && sequencial > maiorSequencial) {
          maiorSequencial = sequencial
        }
      }
    })

    // Gerar o próximo código
    const proximoSequencial = maiorSequencial + 1
    const proximoCodigo = `${prefixo}-${proximoSequencial.toString().padStart(3, "0")}`

    return NextResponse.json({ codigo: proximoCodigo })
  } catch (error) {
    console.error("Erro ao gerar próximo código:", error)
    return NextResponse.json({ error: "Erro ao gerar próximo código" }, { status: 500 })
  }
}
