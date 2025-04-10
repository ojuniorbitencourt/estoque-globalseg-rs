import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { produtoId, quantidade, tipo, origem, destino, observacao } = await request.json()

    // Validar dados
    if (!produtoId) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    if (!quantidade || quantidade <= 0) {
      return NextResponse.json({ error: "Quantidade deve ser maior que zero" }, { status: 400 })
    }

    if (!["entrada", "saida", "transferencia"].includes(tipo)) {
      return NextResponse.json({ error: "Tipo de movimentação inválido" }, { status: 400 })
    }

    // Verificar se o produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
    })

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Iniciar transação
    const result = await prisma.$transaction(async (tx) => {
      // Registrar movimentação
      const movimentacao = await tx.movimentacaoEstoque.create({
        data: {
          produtoId,
          quantidade,
          tipo,
          origem: origem || null,
          destino: destino || null,
          observacao,
        },
      })

      // Atualizar estoque do produto conforme o tipo de movimentação
      if (tipo === "entrada") {
        // Entrada no estoque geral
        await tx.produto.update({
          where: { id: produtoId },
          data: {
            quantidadeEstoque: {
              increment: quantidade,
            },
          },
        })
      } else if (tipo === "saida") {
        // Verificar se há estoque suficiente
        if (produto.quantidadeEstoque < quantidade) {
          throw new Error("Estoque insuficiente para esta operação")
        }

        // Saída do estoque geral
        await tx.produto.update({
          where: { id: produtoId },
          data: {
            quantidadeEstoque: {
              decrement: quantidade,
            },
          },
        })
      } else if (tipo === "transferencia") {
        // Transferência entre estoques
        if (origem === "geral") {
          // Verificar se há estoque suficiente
          if (produto.quantidadeEstoque < quantidade) {
            throw new Error("Estoque insuficiente para esta operação")
          }

          // Transferência do estoque geral para um técnico
          await tx.produto.update({
            where: { id: produtoId },
            data: {
              quantidadeEstoque: {
                decrement: quantidade,
              },
            },
          })

          // Adicionar ao estoque do técnico
          if (destino) {
            const estoqueExistente = await tx.estoqueTecnico.findUnique({
              where: {
                tecnicoId_produtoId: {
                  tecnicoId: destino,
                  produtoId,
                },
              },
            })

            if (estoqueExistente) {
              await tx.estoqueTecnico.update({
                where: {
                  tecnicoId_produtoId: {
                    tecnicoId: destino,
                    produtoId,
                  },
                },
                data: {
                  quantidade: {
                    increment: quantidade,
                  },
                },
              })
            } else {
              await tx.estoqueTecnico.create({
                data: {
                  tecnicoId: destino,
                  produtoId,
                  quantidade,
                },
              })
            }
          }
        } else if (destino === "geral") {
          // Transferência de um técnico para o estoque geral
          if (origem) {
            const estoqueExistente = await tx.estoqueTecnico.findUnique({
              where: {
                tecnicoId_produtoId: {
                  tecnicoId: origem,
                  produtoId,
                },
              },
            })

            if (!estoqueExistente || estoqueExistente.quantidade < quantidade) {
              throw new Error("Estoque do técnico insuficiente para esta operação")
            }

            await tx.estoqueTecnico.update({
              where: {
                tecnicoId_produtoId: {
                  tecnicoId: origem,
                  produtoId,
                },
              },
              data: {
                quantidade: {
                  decrement: quantidade,
                },
              },
            })

            // Adicionar ao estoque geral
            await tx.produto.update({
              where: { id: produtoId },
              data: {
                quantidadeEstoque: {
                  increment: quantidade,
                },
              },
            })
          }
        } else if (origem && destino) {
          // Transferência entre técnicos
          const estoqueExistente = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: origem,
                produtoId,
              },
            },
          })

          if (!estoqueExistente || estoqueExistente.quantidade < quantidade) {
            throw new Error("Estoque do técnico de origem insuficiente para esta operação")
          }

          // Reduzir do estoque do técnico de origem
          await tx.estoqueTecnico.update({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: origem,
                produtoId,
              },
            },
            data: {
              quantidade: {
                decrement: quantidade,
              },
            },
          })

          // Adicionar ao estoque do técnico de destino
          const estoqueDestinoExistente = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: destino,
                produtoId,
              },
            },
          })

          if (estoqueDestinoExistente) {
            await tx.estoqueTecnico.update({
              where: {
                tecnicoId_produtoId: {
                  tecnicoId: destino,
                  produtoId,
                },
              },
              data: {
                quantidade: {
                  increment: quantidade,
                },
              },
            })
          } else {
            await tx.estoqueTecnico.create({
              data: {
                tecnicoId: destino,
                produtoId,
                quantidade,
              },
            })
          }
        }
      }

      return movimentacao
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao registrar movimentação de estoque:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Buscar histórico de movimentações
    const movimentacoes = await prisma.movimentacaoEstoque.findMany({
      include: {
        produto: {
          select: {
            nome: true,
            codigo: true,
          },
        },
        tecnicoOrigem: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        tecnicoDestino: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        dataMovimentacao: "desc",
      },
      take: 50, // Limitar a 50 registros mais recentes
    })

    return NextResponse.json(movimentacoes)
  } catch (error) {
    console.error("Erro ao buscar movimentações de estoque:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
