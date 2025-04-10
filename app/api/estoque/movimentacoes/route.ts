import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Dados recebidos para movimentação:", data)

    // Validar dados
    if (!data.produtoId) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    if (!data.quantidade || data.quantidade <= 0) {
      return NextResponse.json({ error: "Quantidade deve ser maior que zero" }, { status: 400 })
    }

    if (!["entrada", "saida", "transferencia"].includes(data.tipo)) {
      return NextResponse.json({ error: "Tipo de movimentação inválido" }, { status: 400 })
    }

    // Verificar se o produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: data.produtoId },
    })

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    // Iniciar transação
    const result = await prisma.$transaction(async (tx) => {
      // Preparar dados para a movimentação
      const movimentacaoData = {
        produtoId: data.produtoId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        observacao: data.observacao || null,
      }

      // Adicionar origem e destino conforme o tipo de movimentação
      if (data.tipo === "transferencia") {
        // Verificar se origem e destino são válidos
        if (!data.origem) {
          throw new Error("Origem é obrigatória para transferências")
        }

        if (!data.destino) {
          throw new Error("Destino é obrigatório para transferências")
        }

        // Verificar se origem é "geral" ou um ID de técnico válido
        if (data.origem !== "geral") {
          const tecnicoOrigem = await tx.tecnico.findUnique({
            where: { id: data.origem },
          })

          if (!tecnicoOrigem) {
            throw new Error("Técnico de origem não encontrado")
          }
        }

        // Verificar se destino é "geral" ou um ID de técnico válido
        if (data.destino !== "geral") {
          const tecnicoDestino = await tx.tecnico.findUnique({
            where: { id: data.destino },
          })

          if (!tecnicoDestino) {
            throw new Error("Técnico de destino não encontrado")
          }
        }

        // Registrar movimentação
        const movimentacao = await tx.movimentacaoEstoque.create({
          data: {
            ...movimentacaoData,
            origem: data.origem === "geral" ? null : data.origem,
            destino: data.destino === "geral" ? null : data.destino,
          },
        })

        // Atualizar estoques conforme a transferência
        if (data.origem === "geral") {
          // Verificar se há estoque suficiente
          if (produto.quantidadeEstoque < data.quantidade) {
            throw new Error("Estoque insuficiente para esta operação")
          }

          // Transferência do estoque geral para um técnico
          await tx.produto.update({
            where: { id: data.produtoId },
            data: {
              quantidadeEstoque: {
                decrement: data.quantidade,
              },
            },
          })

          // Adicionar ao estoque do técnico
          if (data.destino !== "geral") {
            const estoqueExistente = await tx.estoqueTecnico.findUnique({
              where: {
                tecnicoId_produtoId: {
                  tecnicoId: data.destino,
                  produtoId: data.produtoId,
                },
              },
            })

            if (estoqueExistente) {
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
              await tx.estoqueTecnico.create({
                data: {
                  tecnicoId: data.destino,
                  produtoId: data.produtoId,
                  quantidade: data.quantidade,
                },
              })
            }
          }
        } else if (data.destino === "geral") {
          // Transferência de um técnico para o estoque geral
          const estoqueExistente = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.origem,
                produtoId: data.produtoId,
              },
            },
          })

          if (!estoqueExistente || estoqueExistente.quantidade < data.quantidade) {
            throw new Error("Estoque do técnico insuficiente para esta operação")
          }

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

          // Adicionar ao estoque geral
          await tx.produto.update({
            where: { id: data.produtoId },
            data: {
              quantidadeEstoque: {
                increment: data.quantidade,
              },
            },
          })
        } else {
          // Transferência entre técnicos
          const estoqueExistente = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.origem,
                produtoId: data.produtoId,
              },
            },
          })

          if (!estoqueExistente || estoqueExistente.quantidade < data.quantidade) {
            throw new Error("Estoque do técnico de origem insuficiente para esta operação")
          }

          // Reduzir do estoque do técnico de origem
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

          // Adicionar ao estoque do técnico de destino
          const estoqueDestinoExistente = await tx.estoqueTecnico.findUnique({
            where: {
              tecnicoId_produtoId: {
                tecnicoId: data.destino,
                produtoId: data.produtoId,
              },
            },
          })

          if (estoqueDestinoExistente) {
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
            await tx.estoqueTecnico.create({
              data: {
                tecnicoId: data.destino,
                produtoId: data.produtoId,
                quantidade: data.quantidade,
              },
            })
          }
        }

        return movimentacao
      } else if (data.tipo === "entrada") {
        // Entrada no estoque geral
        const movimentacao = await tx.movimentacaoEstoque.create({
          data: movimentacaoData,
        })

        await tx.produto.update({
          where: { id: data.produtoId },
          data: {
            quantidadeEstoque: {
              increment: data.quantidade,
            },
          },
        })

        return movimentacao
      } else if (data.tipo === "saida") {
        // Verificar se há estoque suficiente
        if (produto.quantidadeEstoque < data.quantidade) {
          throw new Error("Estoque insuficiente para esta operação")
        }

        // Saída do estoque geral
        const movimentacao = await tx.movimentacaoEstoque.create({
          data: movimentacaoData,
        })

        await tx.produto.update({
          where: { id: data.produtoId },
          data: {
            quantidadeEstoque: {
              decrement: data.quantidade,
            },
          },
        })

        return movimentacao
      }
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
