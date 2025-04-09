import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema for movement validation
const movimentacaoSchema = z.object({
  produtoId: z.string().uuid(),
  quantidade: z.number().int().positive(),
  tipo: z.enum(["entrada", "saida", "transferencia"]),
  origem: z.string().optional(),
  destino: z.string().optional(),
  observacao: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const movimentacoes = await prisma.movimentacaoEstoque.findMany({
      include: {
        produto: true,
      },
      orderBy: {
        dataMovimentacao: "desc",
      },
    })

    return NextResponse.json(movimentacoes)
  } catch (error) {
    console.error("Erro ao buscar movimentações de estoque:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received inventory movement request:", data)

    // Validate data
    const validation = movimentacaoSchema.safeParse(data)
    if (!validation.success) {
      console.error("Validation error:", validation.error.format())
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.format() }, { status: 400 })
    }

    // Verify product exists
    const produto = await prisma.produto.findUnique({
      where: { id: data.produtoId },
    })

    if (!produto) {
      console.error("Product not found:", data.produtoId)
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Handle "geral" special case - convert to null for database
    const origem = data.origem === "geral" ? null : data.origem
    const destino = data.destino === "geral" ? null : data.destino

    // Create movement in a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create movement record
      const movimentacao = await tx.movimentacaoEstoque.create({
        data: {
          produtoId: data.produtoId,
          quantidade: data.quantidade,
          tipo: data.tipo,
          origem: origem,
          destino: destino,
          observacao: data.observacao,
        },
        include: {
          produto: true,
        },
      })

      // Update inventory based on movement type
      if (data.tipo === "entrada") {
        // Increase general inventory
        await tx.produto.update({
          where: { id: data.produtoId },
          data: {
            quantidadeEstoque: {
              increment: data.quantidade,
            },
          },
        })
        console.log(`Added ${data.quantidade} units to general inventory for product ${data.produtoId}`)
      } else if (data.tipo === "saida") {
        // Check if there's enough stock
        if (produto.quantidadeEstoque < data.quantidade) {
          throw new Error("Quantidade insuficiente em estoque")
        }

        // Decrease general inventory
        await tx.produto.update({
          where: { id: data.produtoId },
          data: {
            quantidadeEstoque: {
              decrement: data.quantidade,
            },
          },
        })
        console.log(`Removed ${data.quantidade} units from general inventory for product ${data.produtoId}`)
      } else if (data.tipo === "transferencia") {
        // Transfer from general inventory to technician
        if (data.origem === "geral") {
          // Check if there's enough stock
          if (produto.quantidadeEstoque < data.quantidade) {
            throw new Error("Quantidade insuficiente em estoque geral")
          }

          // Decrease from general inventory
          await tx.produto.update({
            where: { id: data.produtoId },
            data: {
              quantidadeEstoque: {
                decrement: data.quantidade,
              },
            },
          })
          console.log(`Removed ${data.quantidade} units from general inventory for product ${data.produtoId}`)

          // Add to technician's inventory
          if (data.destino && data.destino !== "geral") {
            const existingEstoque = await tx.estoqueTecnico.findUnique({
              where: {
                tecnicoId_produtoId: {
                  tecnicoId: data.destino,
                  produtoId: data.produtoId,
                },
              },
            })

            if (existingEstoque) {
              // Update existing technician inventory
              await tx.estoqueTecnico.update({
                where: {
                  tecnicoId_produtoId: {
                    tecnicoId: data.destino,
                    produtoId: data.produtoId,
                  },
                },
                data: {
                  quantidade: {
                    increment: data.quantidade,
                  },
                },
              })
            } else {
              // Create new technician inventory record
              await tx.estoqueTecnico.create({
                data: {
                  tecnicoId: data.destino,
                  produtoId: data.produtoId,
                  quantidade: data.quantidade,
                },
              })
            }
            console.log(`Added ${data.quantidade} units to technician ${data.destino} for product ${data.produtoId}`)
          }
        }
        // Transfer between technicians
        else if (data.origem && data.origem !== "geral" && data.destino && data.destino !== "geral") {
          // Check if source technician has enough stock
          const sourceEstoque = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.origem,
                produtoId: data.produtoId,
              },
            },
          })

          if (!sourceEstoque || sourceEstoque.quantidade < data.quantidade) {
            throw new Error("Quantidade insuficiente no estoque do técnico de origem")
          }

          // Decrease from source technician
          await tx.estoqueTecnico.update({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.origem,
                produtoId: data.produtoId,
              },
            },
            data: {
              quantidade: {
                decrement: data.quantidade,
              },
            },
          })
          console.log(`Removed ${data.quantidade} units from technician ${data.origem} for product ${data.produtoId}`)

          // Add to destination technician
          const destEstoque = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.destino,
                produtoId: data.produtoId,
              },
            },
          })

          if (destEstoque) {
            // Update existing technician inventory
            await tx.estoqueTecnico.update({
              where: {
                tecnicoId_produtoId: {
                  tecnicoId: data.destino,
                  produtoId: data.produtoId,
                },
              },
              data: {
                quantidade: {
                  increment: data.quantidade,
                },
              },
            })
          } else {
            // Create new technician inventory record
            await tx.estoqueTecnico.create({
              data: {
                tecnicoId: data.destino,
                produtoId: data.produtoId,
                quantidade: data.quantidade,
              },
            })
          }
          console.log(`Added ${data.quantidade} units to technician ${data.destino} for product ${data.produtoId}`)
        }
        // Transfer from technician to general inventory
        else if (data.origem && data.origem !== "geral" && data.destino === "geral") {
          // Check if technician has enough stock
          const tecnicoEstoque = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.origem,
                produtoId: data.produtoId,
              },
            },
          })

          if (!tecnicoEstoque || tecnicoEstoque.quantidade < data.quantidade) {
            throw new Error("Quantidade insuficiente no estoque do técnico")
          }

          // Decrease from technician
          await tx.estoqueTecnico.update({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.origem,
                produtoId: data.produtoId,
              },
            },
            data: {
              quantidade: {
                decrement: data.quantidade,
              },
            },
          })
          console.log(`Removed ${data.quantidade} units from technician ${data.origem} for product ${data.produtoId}`)

          // Add to general inventory
          await tx.produto.update({
            where: { id: data.produtoId },
            data: {
              quantidadeEstoque: {
                increment: data.quantidade,
              },
            },
          })
          console.log(`Added ${data.quantidade} units to general inventory for product ${data.produtoId}`)
        }
      }

      return movimentacao
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao criar movimentação de estoque:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
