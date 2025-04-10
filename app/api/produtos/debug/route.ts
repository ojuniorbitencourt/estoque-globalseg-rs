import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("API DEBUG - Dados recebidos:", data)

    // Apenas retornar sucesso sem fazer nada com o banco de dados
    return NextResponse.json(
      {
        success: true,
        message: "Dados recebidos com sucesso (modo debug)",
        data: data,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API DEBUG - Erro:", error)
    return NextResponse.json(
      {
        error: "Erro no processamento",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
